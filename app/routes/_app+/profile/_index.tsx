import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaUser } from "react-icons/fa6";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { Profile } from "~/components/ui";


export const loader: LoaderFunction = async ({ request }) => {
    try {
        const user = await Service.auth.authenticator.isAuthenticated(request);
        // TODO: verify this
        const payment = await Service.user.findOne(user?.id);
        return handlerSuccess(200, payment);
    } catch (error) {
      return handlerError(error);
    }
}

export const handle = {
    breadcrumb: () => {
        return {
            href: `/profile`,
            label: 'Mi perfil',
            startContent: <FaUser />,
        };
    }
}

export default function ProfilePage() {

    const user = useLoaderData<typeof loader>();

    return (<Profile 
        user={user.serverData} 
        url='/profile/edit'
    />)

}