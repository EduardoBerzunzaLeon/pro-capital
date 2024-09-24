import { redirect, type ActionFunction, type ActionFunctionArgs } from "@remix-run/node";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
// import { redirect } from "@remix-run/node";
import { Service } from "~/.server/services";

export const clientAction: ActionFunction = async ({
    request
}: ActionFunctionArgs) => {
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
        
        if(data._action === 'verify') {
            const { status } = await Service.credit.verifyToCreate(formData);
    
            const { curp } = data;
            
            if(status === 'new_record') {
                return redirect(`/clients/test`)
            }

            if(status === 'renovate') {
                return redirect(`./${curp}/renovate`)
            }

            return status;


    
        }

    } catch (error) {
        return handlerErrorWithToast(error, data);
    }

}