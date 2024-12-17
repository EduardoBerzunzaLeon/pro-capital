import { Button } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { FaUsersGear } from "react-icons/fa6";
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
    const navigate = useNavigate()

    const handlePress= () => {
        navigate('/profile/edit')
    }
    
    return (<Profile 
        user={user.serverData} 
        footerContent={<Button variant='ghost' color='primary' className='w-full' onPress={handlePress}> Actualizar mis datos </Button>}
    />)

}