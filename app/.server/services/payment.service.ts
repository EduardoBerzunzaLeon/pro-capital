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
    
    if(currentDebt !== paymentAmount && status === 'LIQUIDADO') {
        throw ServerError.badRequest('No puede asignar el estatus liquidado a un credito con deuda');
    }

    const paymentDb = await Repository.payment.findByDate(id, paymentDate);

    if(paymentDb) {
        throw ServerError.badRequest(`Ya existe un pago con la fecha de ${paymentDate}`);
    }

    //  ======= La fecha de pago no puede ser menor a la fecha de alta ============
    //  ======= No puede crear un pago menor o igual al ultimo pago ==========

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
        status: creditDb.status,
        totalAmount: creditDb.totalAmount,
        currentDebt: currentDebt - paymentAmount,
        paymentAmount: creditDb.paymentAmount,
     });

     
    return paymentCreated;
}


//  =============== No puede eliminar un pago ya que este renovado, pero liquidado si se puede ================

export default {
    createOne
}