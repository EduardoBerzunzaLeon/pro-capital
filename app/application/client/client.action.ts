import { redirect, type ActionFunction, type ActionFunctionArgs } from "@remix-run/node";
import { handlerSuccessWithToast } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
// import { redirect } from "@remix-run/node";
import { Service } from "~/.server/services";

export const clientAction: ActionFunction = async ({
    request
}: ActionFunctionArgs) => {
    
    const formData = await request.formData();
    const url = new URL(request.url);
    const data = Object.fromEntries(formData);

    try {
        
        if(data._action === 'verify') {
            const { status } = await Service.credit.verifyToCreate(formData);
    
            const { curp } = data;

            if(status === 'new_record') {
                return redirect(`/clients/${curp}/create`)
            }

            if(status === 'renovate') {
                return redirect(`./${curp}/credits?${url.searchParams}`)
            }

            return status;
        }

        if(data._action === 'generate') {
            await Service.credit.calculateOverdueCredits();
            return handlerSuccessWithToast('update', 'las cuentas vencidas');
        }

    } catch (error) {
        console.log({error})
        return handlerErrorWithToast(error, data);
    }

}