import { redirect, type ActionFunction, type ActionFunctionArgs } from "@remix-run/node";
import { handlerSuccessWithToast } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
// import { redirect } from "@remix-run/node";
import { Service } from "~/.server/services";
import { permissions } from '~/application';

export const clientAction: ActionFunction = async ({
    request
}: ActionFunctionArgs) => {
    
    const formData = await request.formData();
    const url = new URL(request.url);
    const data = Object.fromEntries(formData);

    try {
        
        
        if(data._action === 'verify') {
            await Service.auth.requirePermission(request, permissions.credits.permissions.add);
            const { status } = await Service.credit.verifyToCreate(formData);
    
            const { curp } = data;

            if(status === 'new_record') {
                return redirect(`/clients/${curp}/create`)
            }

            await Service.auth.requirePermission(request, permissions.credits.permissions.renovate);
            return redirect(`./${curp}/credits?${url.searchParams}`);
        }

        if(data._action === 'generate') {
            await Service.auth.requirePermission(request, permissions.utils.permissions.generate_overdue);
            await Service.credit.calculateOverdueCredits();
            return handlerSuccessWithToast('update', 'las cuentas vencidas');
        }

    } catch (error) {
        console.log({error});
        return handlerErrorWithToast(error, data);
    }

}