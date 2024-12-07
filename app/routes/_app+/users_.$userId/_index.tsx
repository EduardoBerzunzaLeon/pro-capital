import { Avatar, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "~/application";
import { ChipStatus } from "~/components/ui";

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

export default function UserPage() {

    const user = useLoaderData<typeof loader>();
    
    return (
    <div>
        <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center gap-2">
            <Avatar 
                isBordered 
                radius="full"
                className="w-20 h-20 text-large" 
                src={`/img/${user.serverData.avatar}`} 
            />
            <h4 className="font-bold text-large capitalize">{ user.serverData.fullName }</h4>
            <small className="text-default-500"> { user.serverData.role.role  } </small>
        </CardHeader>
        <CardBody className="overflow-visible py-2 flex-col items-start gap-2">
            <p>Correo Electronico: <span className='font-bold'>{ user.serverData.email }</span></p>
            <p>Usuario: <span className='font-bold'>{ user.serverData.username }</span></p>
            <p>Sexo: <span className='font-bold capitalize'>{ user.serverData.sex }</span></p>
            <p>Dirección: <span className='font-bold capitalize'>{ user.serverData.address }</span></p>
            <ChipStatus isActive={ user.serverData.isActive }/>
        </CardBody>
        </Card>
    </div>)

}