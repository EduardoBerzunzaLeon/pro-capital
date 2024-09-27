import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData, useRouteError, useNavigate } from '@remix-run/react';
import { Generic } from "~/.server/interfaces";
import { handlerError } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { ErrorCard } from "~/components/utils/ErrorCard";
import { ClientFormSection } from '../../../components/ui/credit/ClientFormSection';
import { AvalFormSection, CreditFormSection } from "~/components/ui";
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { getFormProps, useForm } from "@conform-to/react";
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


export const action: ActionFunction = async ({ request }) => {
    console.log('inside');
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // data: {
    //     'client.name': 'eduardo',
    //     'client.lastNameFirst': 'berzunza',
    //     'client.lastNameSecond': 'leon',
    //     'client.address': 'asdasd',
    //     'client.reference': 'asdasd',
    //     'client.guarantee': 'qasdasdasd',
    //     'client.phoneNumber': '912312',
    //     'aval[id]': '1',
    //     'aval[value]': 'AUNI760709MCCYHV01',
    //     'aval.name': 'fatima',
    //     'aval.lastNameFirst': 'bernes',
    //     'aval.lastNameSecond': 'hermoxa',
    //     'aval.address': 'col bosque real',
    //     'aval.reference': 'atras de refaccionaria leon',
    //     'aval.guarantee': 'mi esposo',
    //     'aval.phoneNumber': '98112236445',
    //     'folder[id]': '5',
    //     'folder[value]': 'maxcanu 1',
    //     'credit.group': '10',
    //     'credit.types': 'NORMAL',
    //     'credit.amount': '1500',
    //     'credit.creditAt': '2024-09-25',
    //     _action: ''
    //   }
    console.log({data});


    return [];
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
    const navigate = useNavigate();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditCreateSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
      }); 

    const handleCancel = () => {
        navigate('/clients')
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <h2>Creación de nuevo cliente {curp}</h2>
            </CardHeader>
            <CardBody>
                <Form
                    method="post" 
                    { ...getFormProps(form) }
                    className="w-full"
                >
                    <Accordion 
                        variant="splitted" 
                        selectionMode="multiple"
                        // defaultExpandedKeys='all'
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
                                <CreditFormSection 
                                    fields={fields.credit}
                                />
                            </AccordionItem>
                    </Accordion>
                    <Button 
                        color="danger" 
                        variant="light" 
                        onPress={handleCancel} 
                        type='button'
                    >
                        Cancelar
                    </Button>
                    <Button 
                        color="primary" 
                        type='submit'
                        // isLoading={navigation.state === 'submitting'}
                        // isDisabled={navigation.state !== 'idle'}
                        name='_action'
                    >
                        Crear Crédito
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}