import { idSchema, paymentServerSchema } from "~/schemas";
import { validationConform, validationZod } from "./validation.service";
import { RequestId } from "../interfaces";
import { ServerError } from "../errors";
import { Repository } from "../adapter";
import { Service } from ".";

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

    if(status === 'GARANTIA' && (notes === '' || !notes )) {
        throw ServerError.badRequest('El campo notas tiene que incluir la garantía')
    }

    if(form.get('agent[value]') !== form.get('agent')) {
        throw ServerError.badRequest('El agente es invalido, favor de seleccionar una opción del autocomplete');
    }

    const creditDb = await Service.credit.findCreditToPay(id);
    const currentDebt = Number(creditDb.currentDebt);

    if(currentDebt < paymentAmount) {
        throw ServerError.badRequest('El monto abonado no puede ser mayor que la deuda actual');
    }

    if(paymentDate < creditDb.creditAt) {
        throw ServerError.badRequest('La fecha de pago no puede ser menor a la fecha de alta del crédito');
    }

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

export const deleteOne = async (idPayment: RequestId) => {

    const { id } = validationZod({ id: idPayment }, idSchema);

    // Traer los datos del pago, verificar que exista el pago
    const paymentDb = await Repository.payment.findOne(id);

    if(!paymentDb) {
        throw ServerError.notFound('El pago no existe');
    }
    // Traer el credito con sus pagos, verificar que el credito no tenga una renovación asignada
    // Recalcular Renovacion, lastpayment, nextPayemnt, status, currentDebt

}

export default {
    createOne
}