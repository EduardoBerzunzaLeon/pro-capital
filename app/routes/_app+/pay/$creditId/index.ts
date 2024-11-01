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
      return handlerSuccessWithToast('create');
    }

    // if(data._action === 'delete') {
    //   await Service.town.deleteOne(id);
    //   return handlerSuccessWithToast('delete');
    // }

    return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

  } catch (error) {
    return handlerErrorWithToast(error, data);
  }
}