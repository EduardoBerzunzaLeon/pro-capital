import { LoaderFunction } from "@remix-run/node"
import { useLoaderData, useRouteError } from "@remix-run/react";
import { Generic } from "~/.server/interfaces";
import { handlerError } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { ErrorCard } from "~/components/utils/ErrorCard";
import { ClientFormSection } from '../../../components/ui/credit/ClientFormSection';
import { AvalFormSection, CreditFormSection } from "~/components/ui";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { creditCreateSchema } from "~/schemas";
import { useState } from "react";

export const loader: LoaderFunction = async ({ params }) => {
    
    try {
        await Service.credit.validationToCreate(params.curp)
    } catch (err) {
     const  { error, status } = handlerError(err);
     throw new Response(error, { status });
    }

    return params.curp!.toUpperCase();
}

export function ErrorBoundary() {
    const error = useRouteError();

    return (<ErrorCard 
        error={(error as Generic)?.data ?? 'Ocurrio un error inesperado'}
        description='Ocurrio un error al momento de crear un nuevo credito, intentelo de nuevo, verifique el CURP o que no exista el cliente'
    />)
  }


export default function CreateCredit () {

    const loader = useLoaderData<string>();

    const [name, setName ] = useState('');

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditCreateSchema });
        },
        shouldValidate: 'onInput',
        shouldRevalidate: 'onSubmit',
      }); 
    

    console.log({ name });



    return (
        <Accordion variant="splitted" selectionMode="multiple">
            <AccordionItem 
                key="1" 
                aria-label="Formulario del cliente" 
                title="Formulario del Cliente"
            >
                <ClientFormSection />
            </AccordionItem>
            <AccordionItem 
                key="2" 
                aria-label="Formulario del Aval" 
                title="Formulario del Aval"
            >
                <AvalFormSection 
                    fields={name}
                    setName={setName}
                />
            </AccordionItem>
            <AccordionItem 
                key="3" 
                aria-label="Formulario del credito" 
                title="Formulario del Crédito"
            >
                <CreditFormSection />
            </AccordionItem>
        </Accordion>
    )
}