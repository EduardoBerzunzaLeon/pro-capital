import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaUserCog } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { AvatarForm, PasswordForm, UserEditForm } from "~/components/ui";

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const user = await Service.auth.authenticator.isAuthenticated(request);
        const payment = await Service.user.findOne(user?.id);
        return handlerSuccess(200, payment);
    } catch (error) {
      return handlerError(error);
    }
}

export const handle = {
    breadcrumb: () => {
        return [
            {
                href: `/profile`,
                label: 'Mi perfil',
                startContent: <FaUser />,
            },
            {
                href: `/profile/edit`,
                label: 'Editar mis datos',
                startContent: <FaUserCog />,
            }   
        ];
    }
}

export default function EditProfilePage() {

    const user = useLoaderData<typeof loader>();

    return(
        <div className='w-full flex flex-wrap gap-4 items-start justify-between'>
            <PasswordForm id={user.serverData.id} />
            <AvatarForm id={user.serverData.id}/>
            <UserEditForm { ...user.serverData }/>  
        </div>
    )

}