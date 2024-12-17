import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaUsersGear } from "react-icons/fa6";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
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

export const handle = {
    breadcrumb: (data: { serverData?: { id: number }}) => {
        return {
            href: `/profile/${data?.serverData?.id}`,
            label: 'Mi perfil',
            startContent: <FaUsersGear />,
        };
    }
}


export default function ProfilePage() {

    const user = useLoaderData<typeof loader>();
    
    return (<Profile user={user.serverData} />)

}