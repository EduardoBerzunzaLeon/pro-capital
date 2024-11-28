import { LoaderFunction } from "@remix-run/node";
import {  useLoaderData } from "@remix-run/react";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { UserEditForm } from "~/components/ui";

export const loader: LoaderFunction = async ({ params }) => {
    const { userId } = params;
    try {
        const payment = await Service.user.findOne(userId);
        return handlerSuccess(200, payment);
    } catch (error) {
      return handlerError(error);
    }
}

export default function UserEditPage() {
    const user = useLoaderData<typeof loader>();


    return (<>
        <UserEditForm 
            { ...user.serverData }
        />    
    </>)
}