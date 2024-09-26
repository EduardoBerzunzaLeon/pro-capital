import { LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData, useRouteError } from "@remix-run/react";
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

    const curp = useLoaderData<string>();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditCreateSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
      }); 

    return (
        <Form
            method="post" 
            id={form.id} 
            onSubmit={form.onSubmit} 
            noValidate
            className="w-full"
        >
            <Accordion 
                variant="splitted" 
                selectionMode="multiple"
                defaultExpandedKeys='all'
                keepContentMounted
            >
                    <AccordionItem 
                        key="1" 
                        aria-label="Formulario del cliente" 
                        title="Formulario del Cliente"
                    >
                        <ClientFormSection 
                            fields={fields.client}
                        />
                    </AccordionItem>
                    <AccordionItem 
                        key="2" 
                        aria-label="Formulario del Aval" 
                        title="Formulario del Aval"
                    >
                        <AvalFormSection 
                            fields={fields.aval}
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
        </Form>
    )
}