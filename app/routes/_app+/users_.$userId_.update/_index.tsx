import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {  useLoaderData } from "@remix-run/react";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast, handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { AvatarForm, PasswordForm, RoleForm, UserEditForm } from "~/components/ui";

export const loader: LoaderFunction = async ({ params }) => {
    const { userId } = params;
    try {
        const payment = await Service.user.findOne(userId);
        return handlerSuccess(200, payment);
    } catch (error) {
      return handlerError(error);
    }
}

export const action: ActionFunction = async ({ params, request }) => {

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.userId;

    try {
        
        if(data._action === 'updatePersonalData') {
            await Service.user.updatePersonalData(id, formData);
            return handlerSuccessWithToast("update", "Los datos personales");
        }
        
        if(data._action === 'updateRole' ){
            await Service.user.updateRole(id, formData);
            return handlerSuccessWithToast("update", "El role");
        }
        
        if(data._action === 'updatePassword' ){
            await Service.user.updatePassword(id, formData);
            return handlerSuccessWithToast("update", "La contraseña");
        }

        return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
        return handlerErrorWithToast(error, data);
    }

}


export default function UserEditPage() {
    const user = useLoaderData<typeof loader>();

    return (<div className='w-full flex flex-wrap gap-2 items-start'>
        <UserEditForm 
            { ...user.serverData }
        />    
        <PasswordForm 
            id={user.serverData.id}
        />
        <RoleForm 
            role={user.serverData.role.id}
            id={user.serverData.id}
        />
        <AvatarForm id={user.serverData.id}/>
    </div>)
}