import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {  useLoaderData } from "@remix-run/react";
import { FaUserCog } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast, handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "~/application";
import { AvatarForm, PasswordForm, RoleForm, UserEditForm } from "~/components/ui";
import { Permission } from "~/components/ui/auth/Permission";

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
            await Service.auth.requirePermission(request, permissions.users.permissions.update, id);
            await Service.user.updatePersonalData(id, formData);
            return handlerSuccessWithToast("update", "Los datos personales");
        }
        
        if(data._action === 'updateRole' ){
            await Service.auth.requirePermission(request, permissions.users.permissions.update_security);
            await Service.user.updateRole(id, formData);
            return handlerSuccessWithToast("update", "El role");
        }
        
        if(data._action === 'updatePassword' ){
            // TODO: when is my profile  not is necesary this validation;
            await Service.auth.requirePermission(request, permissions.users.permissions.update_security, id);
            await Service.user.updatePassword(id, formData);
            return handlerSuccessWithToast("update", "La contraseña");
        }

        return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
        return handlerErrorWithToast(error, data);
    }
}

export const handle = {
    breadcrumb: (data: { status: string, serverData?: { id: number, username: string } }) => {
        return [
            {
                href: '/users',
                label: 'Usuarios',
                startContent: <FaUsersGear />,
            },
            {
                href: `/users/${data?.serverData?.id}`,
                label: `Editar a ${data?.serverData?.username}`,
                startContent: <FaUserCog />,
            },
        ]
    }
}

export default function UserEditPage() {
    const user = useLoaderData<typeof loader>();

    return (<div className='w-full flex flex-wrap gap-2 items-start'>
        <Permission permission={permissions.users.permissions.update_security}>
            <PasswordForm id={user.serverData.id} />
        </Permission>
        <Permission permission={permissions.users.permissions.update_security}>
            <RoleForm 
                role={user.serverData.role.id}
                id={user.serverData.id}
            />
        </Permission>
        <Permission permission={permissions.users.permissions.update}>
            <AvatarForm id={user.serverData.id}/>
        </Permission>
        <Permission permission={permissions.users.permissions.update}>
            <UserEditForm { ...user.serverData } />    
        </Permission>
    </div>)
}