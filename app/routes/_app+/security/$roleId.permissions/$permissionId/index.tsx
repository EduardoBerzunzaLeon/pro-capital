import { ActionFunction } from "@remix-run/node";
import { handlerErrorWithToast, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";


export const action: ActionFunction = async({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const { roleId, permissionId } = params;

    try {
              
        if(data._action === 'updateIsAssigned') {
            const isAssigned = data?.isAssigned === 'true';

            await Service.permission.updateIsAssigned(roleId, permissionId, isAssigned);
            return handlerSuccessWithToast('update', 'La lider');
        }
    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  
  }