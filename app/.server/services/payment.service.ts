import { idSchema, paymentServerSchema } from "~/schemas";
import { validationConform, validationZod } from "./validation.service";
import { RequestId } from "../interfaces";
import { ServerError } from "../errors";
import { Repository } from "../adapter";
import { Service } from ".";
import { findNow, permissions } from "~/application";
import { PaginationWithFilters } from "../domain/interface";
import { Payment } from "../domain/entity";
import dayjs from 'dayjs';
import { noPaymentServerSchema } from '../../schemas/paymentSchema';
import { PaymentProps } from "./excelReport.service";
import { RoleTypes } from "@prisma/client";


export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } = await Repository.payment.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data,
        mapper: Payment.mapper,
        errorMessage: 'No se encontraron pagos'
    });
}

export const exportData = async (props:PaginationWithFilters) => {
    const data = await Repository.payment.findByReport(props);
    return Service.excel.paymentReport(data as PaymentProps[]);
}

const validateAgent = (form: FormData ) => {
    if(form.get('agent[value]') !== form.get('agent')) {
        throw ServerError.badRequest('El agente es invalido, favor de seleccionar una opción del autocomplete');
    }
}

const validateGuarentee = (status: string, notes?: string) => {
    if(status === 'GARANTIA' && (notes === '' || !notes )) {
        throw ServerError.badRequest('El campo notas tiene que incluir la garantía')
    }
}

const validatePaymentDate = (paymentDate: Date, creditAt: Date) => {
    if(paymentDate < creditAt) {
        throw ServerError.badRequest('La fecha de pago no puede ser menor a la fecha de alta del crédito');
    }
}

const validateDebt = (currentDebt: number, paymentAmount: number) => {
    if(currentDebt < paymentAmount) {
        throw ServerError.badRequest('El monto abonado no puede ser mayor que la deuda actual');
    }
}

export const createNoPayment = async (userId: number, form: FormData, creditId?: RequestId) => {
    const { id } = validationZod({ id: creditId }, idSchema);
    const { 
        agentId, 
        paymentDate,
        folio,
        notes
    } = validationConform(form, noPaymentServerSchema);

    validateAgent(form);

    const creditDb = await Service.credit.findCreditToPay(id);
    validatePaymentDate(paymentDate, creditDb.creditAt);

    if(creditDb.lastPayment && paymentDate <= creditDb.lastPayment) {
        throw ServerError.badRequest(`Ya existe un pago con la fecha igual o inferior a ${paymentDate}`);
    }

    const paymentCreated = await Repository.payment.createOne({
        agentId,
        paymentAmount: 0,
        paymentDate,
        folio,
        status: 'NO_PAGO',
        notes,
        creditId: id,
        createdById: userId
    });

    if(!paymentCreated) {
        throw ServerError.badRequest('No se pudo crear el pago');
    }

    await Service.credit.updateCreditByPayment(id, {
        status: creditDb.status,
        totalAmount: creditDb.totalAmount,
        paymentAmount: creditDb.paymentAmount,
        creditAt: creditDb.creditAt,
        type: creditDb.type,
        isRenovate: creditDb.isRenovate,
     });

}

export const createOne =  async (user: { userId: number, role: RoleTypes }, form: FormData, creditId?: RequestId) => {
    const { id } = validationZod({ id: creditId }, idSchema);
    const { 
        agentId, 
        paymentAmount, 
        paymentDate,
        folio,
        status,
        notes
    } = validationConform(form, paymentServerSchema);

    validateGuarentee(status, notes);
    validateAgent(form);

    const creditDb = await Service.credit.findCreditToPay(id);
    const currentDebt = Number(creditDb.currentDebt);

    validatePaymentDate(paymentDate, creditDb.creditAt);
    validateDebt(currentDebt, paymentAmount);

    const hasPermission = await Service.role.hasPermission(user.role,  permissions.payments.permissions.add);

    if(!hasPermission && creditDb.lastPayment && paymentDate <= creditDb.lastPayment) {
        throw ServerError.badRequest(`Ya existe un pago con la fecha igual o inferior a ${paymentDate}`);
    }

    const paymentCreated = await Repository.payment.createOne({
        agentId,
        paymentAmount,
        paymentDate,
        folio,
        status,
        notes,
        creditId: id,
        createdById: user.userId
    });

    if(!paymentCreated) {
        throw ServerError.badRequest('No se pudo crear el pago');
    }
    
     await Service.credit.updateCreditByPayment(id, {
        status: creditDb.status,
        totalAmount: creditDb.totalAmount,
        paymentAmount: creditDb.paymentAmount,
        creditAt: creditDb.creditAt,
        type: creditDb.type,
        isRenovate: creditDb.isRenovate,
     });

     
    return paymentCreated;
}


//  =============== No puede eliminar un pago ya que este renovado, pero liquidado si se puede ================

export const findOne = async (idPayment: RequestId ) => {
    const { id } = validationZod({ id: idPayment }, idSchema);
    const paymentDb = await Repository.payment.findOne(id);

    if(!paymentDb) {
        throw ServerError.notFound('No existe un pago del dia de hoy');
    }

    return paymentDb;
}

export const deleteFastOne = async (idCredit: RequestId) => {
    const { id } = validationZod({ id: idCredit }, idSchema);
    const now = findNow()
    const paymentDb = await Repository.payment.findByDate(id, now);

    if(!paymentDb) {
        throw ServerError.badRequest('No se puede eliminar un pago, que no se haya agregado hoy');
    }

    await deleteOne(paymentDb.id);
}

export const deleteOne = async (idPayment: RequestId) => {

    const paymentDb = await findOne(idPayment);
    
    const { credit } = paymentDb;

    const creditRenovate = await Service.credit.findByPreviousCreditId(credit.id);

    if(creditRenovate) {
        throw ServerError.badRequest('El pago a eliminar ya tiene un crédito de renovación asignado');
    }
    
    const paymentDeleted =  await Repository.payment.deleteOne(paymentDb.id);
    
    if(!paymentDeleted) {
        throw ServerError.internalServer('No se pudo eliminar el pago');
    }

    await Service.credit.updateCreditByPayment(credit.id, {
        status: credit.status,
        totalAmount: Number(credit.totalAmount),
        paymentAmount: Number(credit.paymentAmount),
        creditAt: credit.creditAt,
        type: credit.type,
        isRenovate: credit.isRenovate,
     });
}

export const findLastPayment = async (creditId: number) => {
        const paymentDb = await Repository.payment.findLastPayment(creditId);
        return (paymentDb && paymentDb.length > 0) ? paymentDb[0].paymentDate : undefined;
    }


export const updateOne = async (form: FormData, idPayment: RequestId) => {
    
    const { 
        agentId, 
        paymentAmount, 
        paymentDate,
        folio,
        status,
        notes
    } = validationConform(form, paymentServerSchema);
    const paymentDb = await findOne(idPayment);

    validateGuarentee(status, notes);
    validateAgent(form);

    const { credit } = paymentDb;
    validatePaymentDate(paymentDate, credit.creditAt);

    const creditRenovate = await Service.credit.findByPreviousCreditId(credit.id);

    if(creditRenovate) {
        throw ServerError.badRequest('El pago a actualizar ya tiene un crédito de renovación asignado');
    }

    const currentDebt = Number(credit.currentDebt) + Number(paymentDb.paymentAmount);
    validateDebt(currentDebt, paymentAmount);

    if(dayjs(paymentDate).isSame(dayjs(paymentDb.paymentDate))) {
        const paymentInDate = await Repository.payment.findByDate(credit.id, paymentDate);
        if(paymentInDate && paymentInDate.id !== paymentDb.id) {
            throw ServerError.badRequest(`Ya existe un pago el dia ${paymentDate}`);
        }
    }

    const paymentUpdated =  await Repository.payment.updateOne(paymentDb.id, {
        agentId,
        paymentAmount,
        paymentDate,
        folio,
        status,
        notes
    });

    if(!paymentUpdated) {
        throw ServerError.badRequest('No se pudo actualizar el pago');
    }

    await Service.credit.updateCreditByPayment(credit.id, {
        status: credit.status,
        totalAmount: Number(credit.totalAmount),
        paymentAmount: Number(credit.paymentAmount),
        creditAt: credit.creditAt,
        type: credit.type,
        isRenovate: credit.isRenovate,
     });

}


export const findTotalPayment = async (creditId: number) => {
    const stadistics =  await Repository.payment.findTotalPayment(creditId);

    if(!stadistics) {
        throw ServerError.internalServer('Ocurrio un error al momento de calcular los pagos.');
    }

    if(stadistics.length === 0) {
        return {
            sum: 0,
            count: 0
        }
    }

    return {
        sum: stadistics[0]._sum.paymentAmount ?? 0,
        count: stadistics[0]._count.paymentAmount,
    }
}

export default {
    findAll,
    createOne,
    createNoPayment,
    deleteOne,
    deleteFastOne,
    updateOne,
    findTotalPayment,
    findOne,
    exportData,
    findLastPayment
}