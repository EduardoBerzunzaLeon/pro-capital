import { LoaderFunction } from "@remix-run/node"
import { useLoaderData, useRouteError } from "@remix-run/react";
import { Generic } from "~/.server/interfaces";
import { handlerError } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { CreditPaymentsTable } from "~/components/ui";
import { ErrorCard } from "~/components/utils/ErrorCard";

export const loader: LoaderFunction = async ({ params }) => {

    try {
        return  await Service.credit.validationToRenovate(params.curp);
    } catch (err) {
        const { error, status } = handlerError(err);
        throw new Response(error, { status });
    }
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (<ErrorCard 
        error={(error as Generic)?.data ?? 'Ocurrio un error inesperado'}
        description='Ocurrio un error al momento de renovar un credito, intentelo de nuevo, verifique el CURP o que exista el cliente'
    />)
}

export default function Test () {
    const loader = useLoaderData<any>();
    
    return (<div className='w-full'>
        <CreditPaymentsTable 
            payments={loader.credit.payment_detail}
        />
    </div>)
}