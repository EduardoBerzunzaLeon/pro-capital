import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerSuccessWithToast, handlerErrorWithToast, handlerSuccess, handlerError } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "~/application";

export const loader: LoaderFunction = async ({ params }) => {
    const { paymentId } = params;
    try {
        const payment = await Service.payment.findOne(paymentId);
        return handlerSuccess(200, payment);
    } catch (error) {
      return handlerError(error);
    }
}

export const action: ActionFunction = async({ params, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.paymentId;
  
    try {
        
      if(data._action === 'update') {
        await Service.auth.requirePermission(request, permissions.payments.permissions.update);
        formData.append('agentId', data['agent[id]'] ?? '');
        await Service.payment.updateOne(formData, id);
        return handlerSuccessWithToast('update', 'del pago');
      }
  
      if(data._action === 'delete') {
        await Service.auth.requirePermission(request, permissions.payments.permissions.delete);
        await Service.payment.deleteOne(id);
        return handlerSuccessWithToast('delete', 'del pago');
      }
  
      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
  
    } catch (error) {
      console.log({error});
      return handlerErrorWithToast(error, data);
    }
  }