import { idSchema, paymentServerSchema } from "~/schemas";
import { validationConform, validationZod } from "./validation.service";
import { RequestId } from "../interfaces";
import { ServerError } from "../errors";
import { Repository } from "../adapter";
import dayjs from 'dayjs';
import { Service } from ".";

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

export const createOne =  async (form: FormData, creditId?: RequestId) => {
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

    if(creditDb.lastPayment && paymentDate <= creditDb.lastPayment) {
        throw ServerError.badRequest(`Ya existe un pago con la fecha igual o inferior a ${paymentDate}`);
    }

    const paymentCreated =  await Repository.payment.createOne({
        agentId,
        paymentAmount,
        paymentDate,
        folio,
        status,
        notes,
        creditId: id
    });

    if(!paymentCreated) {
        throw ServerError.badRequest('No se pudo crear el pago');
    }

    //  RECALCULAR SI TIENE DERECHO A RENOVACION
     await Service.credit.updateCreditByPayment(id, {
        currentDebt: currentDebt - paymentAmount,
        paymentDate,
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

const findOne = async (idPayment: RequestId ) => {
    const { id } = validationZod({ id: idPayment }, idSchema);
    const paymentDb = await Repository.payment.findOne(id);

    if(!paymentDb) {
        throw ServerError.notFound('El pago no existe');
    }

    return paymentDb;
}

export const deleteOne = async (idPayment: RequestId, isFastDelete?: boolean) => {

    const paymentDb = await findOne(idPayment);

    if(isFastDelete && paymentDb?.paymentDate !== dayjs().date()) {
        throw ServerError.badRequest('No se puede eliminar un pago, que no se haya agregado hoy');
    }
    
    const { credit } = paymentDb;

    const creditRenovate = await Service.credit.findByPreviousCreditId(credit.id);

    if(creditRenovate) {
        throw ServerError.badRequest('El pago a eliminar ya tiene un crédito de renovación asignado');
    }
    
    const paymentDeleted =  await Repository.payment.deleteOne(paymentDb.id);
    
    if(!paymentDeleted) {
        throw ServerError.internalServer('No se pudo eliminar el pago');
    }

    const paymentDate = (paymentDb.credit.payment_detail.length === 0) 
        ?  undefined
        : paymentDb.credit.payment_detail[0].paymentDate;

    await Service.credit.updateCreditByPayment(credit.id, {
        currentDebt: credit.currentDebt + paymentDb.paymentAmount,
        paymentDate,
        status: credit.status,
        totalAmount: credit.totalAmount,
        paymentAmount: credit.paymentAmount,
        creditAt: credit.creditAt,
        type: credit.type,
        isRenovate: credit.isRenovate,
     });

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

    if(paymentDb.paymentDate !== paymentDate) {
        const paymentInDate = await Repository.payment.findByDate(credit.id, paymentDate);
        if(paymentInDate) {
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

    const lastPayment = paymentDb.credit.payment_detail[0].paymentDate > paymentDate 
        ? paymentDb.credit.payment_detail[0].paymentDate
        : paymentDate;


    await Service.credit.updateCreditByPayment(credit.id, {
        currentDebt: currentDebt - paymentAmount,
        paymentDate: lastPayment,
        status: credit.status,
        totalAmount: credit.totalAmount,
        paymentAmount: credit.paymentAmount,
        creditAt: credit.creditAt,
        type: credit.type,
        isRenovate: credit.isRenovate,
     });

}

export default {
    createOne,
    deleteOne,
    updateOne,
}