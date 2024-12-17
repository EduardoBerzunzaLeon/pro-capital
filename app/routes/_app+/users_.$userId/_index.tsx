import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaUserCog } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "~/application";
import { Profile } from "~/components/ui";

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
        
        if(data._action === 'updateIsActive') {
            await Service.auth.requirePermission(request, permissions.users.permissions.active);
            const isActive = data?.isActive === 'true';
            return await Service.user.updateIsActive(id, isActive);
        }

        return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
        console.log(error);
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
                label: `Perfil de ${data?.serverData?.username}`,
                startContent: <FaUserCog />,
            },
        ]
    }
}
  
export default function UserPage() {
    const user = useLoaderData<typeof loader>();
    
    return (<Profile user={user.serverData} />)

}