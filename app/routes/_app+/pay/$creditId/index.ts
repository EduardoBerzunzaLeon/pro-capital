import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast, handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
    const { creditId } = params;
    try {
        const credit = await Service.credit.findCreditToPay(creditId);
        return handlerSuccess(200, credit);
    } catch (error) {
      return handlerError(error);
    }
}


export const action: ActionFunction = async({ params, request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const id = params.creditId;

  try {
      
    if(data._action === 'addPayment') {
      formData.append('agentId', data['agent[id]'] ?? '');
      await Service.payment.createOne(formData, id);
      return handlerSuccessWithToast('create', 'del pago');
    }
    
    if(data._action === 'addNoPayment') {
      formData.append('agentId', data['agent[id]'] ?? '');
      await Service.payment.createNoPayment(formData, id);
      return handlerSuccessWithToast('create', 'del NO pago');
    }

    if(data._action === 'deleteFast') {
      await Service.payment.deleteFastOne(id);
      return handlerSuccessWithToast('delete', 'del pago');
    }

    return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

  } catch (error) {
    console.log(error);
    return handlerErrorWithToast(error, data);
  }
}