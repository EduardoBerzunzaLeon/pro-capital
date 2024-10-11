import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, Accordion, AccordionItem, Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData, useNavigate, useRouteError } from "@remix-run/react";
import { redirectWithSuccess } from "remix-toast";
import { Generic } from "~/.server/interfaces";
import { handlerError } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";
import { AvalFormSection, ClientFormSection, CreditPaymentsTable, CreditRenovateFormSection } from "~/components/ui";
import { ErrorCard } from "~/components/utils/ErrorCard";
import { creditReadmissionSchema } from "~/schemas/creditSchema";

export const loader: LoaderFunction = async ({ params }) => {

    try {
        return  await Service.credit.validationToRenovate(params.curp);
    } catch (err) {
        const { error, status } = handlerError(err);
        throw new Response(error, { status });
    }
}

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
        await Service.credit.renovate(formData, params?.curp)
        return redirectWithSuccess('/clients', 'El crédito se ha creado con éxito 🎉');
    } catch (error) {
        console.log(error);
        return handlerErrorWithToast(error, { data });
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
    const navigate = useNavigate();
    console.log(loader);

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditReadmissionSchema });
        },
        defaultValue: {
            client: { ...loader.credit.client },
            aval: { ...loader.credit.aval },
            credit: {
                folder: loader.credit.folder.name,
                paymentForgivent: loader.hasPaymentForgivent ? 'true' : 'false'
            },
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
      }); 

    const handleCancel = () => {
        navigate('/clients');
    }

    return (<div className='w-full'>
        <Card className="w-full">
            <CardHeader>
                <h2>Creación de reingreso del cliente { loader.credit.client.fullname.toUpperCase() }</h2>
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
                                <CreditRenovateFormSection 
                                    fields={fields.credit}
                                    paymentForgivent={loader.hasPaymentForgivent}
                                    currentDebt={loader.credit.currentDebt}
                                    folderId={loader.credit.folder.id}
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
                        value='renovate'
                    >
                        Crear Crédito
                    </Button>
                </Form>
            </CardBody>
        </Card>
        <CreditPaymentsTable 
            payments={loader.credit.payment_detail}
        />
    </div>)
}