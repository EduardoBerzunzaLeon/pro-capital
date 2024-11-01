import { idSchema, paymentServerSchema } from "~/schemas";
import { validationConform, validationZod } from "./validation.service";
import { RequestId } from "../interfaces";
import { ServerError } from "../errors";
import { Repository } from "../adapter";
import { Service } from ".";
import { CreatePayment } from '~/.server/domain/interface';
import { CreditI } from "../domain/entity";

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

    if(status === 'GARANTÍA' && notes === '') {
        throw ServerError.badRequest('El campo notas tiene que incluir la garantía')
    }

    const creditDb = await Service.credit.findCreditToPay(id);

    if(creditDb.currentDebt < paymentAmount) {
        throw ServerError.badRequest('El monto abonado no puede ser mayor que la deuda actual');
    }
    
    if(creditDb.currentDebt !== paymentAmount && status === 'LIQUIDADO') {
        throw ServerError.badRequest('No puede asignar el estatus liquidado a un credito con deuda');
    }

    const paymentDb = await Repository.payment.findByDate(id, paymentDate);

    if(paymentDb && paymentDb.length > 0) {
        throw ServerError.badRequest(`Ya existe un pago con la fecha de ${paymentDate}`);
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

    // RECALCULAR SI TIENE DERECHO A RENOVACION
     await Service.credit.updateCreditByPayment(id, {
        status: creditDb.status,
        totalAmount: creditDb.totalAmount,
        currentDebt: creditDb.currentDebt,
        paymentAmount: creditDb.paymentAmount,
     });

     


    // id: 2,
    // data: {
    //   agentId: 1,
    //   paymentAmount: 200,
    //   paymentDate: 2024-11-01T00:00:00.000Z,
    //   folio: 0,
    //   status: 'PAGO',
    //   notes: undefined
    // }



    return 'holiwis';
}

export default {
    createOne
}