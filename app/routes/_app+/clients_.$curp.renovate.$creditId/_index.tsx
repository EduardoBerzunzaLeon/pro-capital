import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, Accordion, AccordionItem, Button, CardFooter } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import { handlerError } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";
import { permissions } from "~/application";
import { AvalFormSection, ClientFormSection, CreditPaymentsTable, CreditRenovateFormSection, ErrorBoundary } from "~/components/ui";
import { creditReadmissionSchema } from "~/schemas/creditSchema";

export const loader: LoaderFunction = async ({ request, params }) => {
    await Service.auth.requirePermission(request, permissions.credits.permissions.renovate);
    try {
        return await Service.credit.validationToRenovate(params.curp, params.creditId);
    } catch (err) {
        const { error } = handlerError(err);
        return redirectWithError('/clients', error);
    }
}

export const action: ActionFunction = async ({ request, params }) => {
    const user = await Service.auth.requirePermission(request, permissions.credits.permissions.renovate);
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        await Service.credit.renovate(user.id, formData, params?.curp, params?.creditId);
        return redirectWithSuccess('/clients', 'El crédito se ha creado con éxito 🎉');
    } catch (error) {
        console.log({error});
        return handlerErrorWithToast(error, { data });
    }
}

export { ErrorBoundary }

export const handle = {
    breadcrumb: (data: { credit: { id: number, client: { curp: string } }}) => {
        return [
            {
              href: '/clients',
              label: 'Créditos',
              startContent: <FaUsers />,
            },
            {
                href: `/users/${data.credit.client.curp}/renovate/${data.credit.id}`,
                label: `Renovar crédito`,
                startContent: <FaUserPlus />,
            },
        ]
    }
}

    export default function RenovateFormPage () {
    const loader = useLoaderData<any>();
    const navigate = useNavigate();
    const navigation = useNavigation();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditReadmissionSchema });
        },
        defaultValue: {
            client: { ...loader.credit.client },
            aval: { ...loader.credit.aval },
            credit: {
                folder: loader.credit.folder.name,
                paymentForgivent: loader.hasPaymentForgivent ? 'true' : 'false',
                amount: Number(loader.credit.amount) + 500
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
            <Form
                method="post" 
                { ...getFormProps(form) }
                className="w-full"
            >
                <CardHeader>
                    <h2>Creación de reingreso del cliente { loader.credit.client.fullname.toUpperCase() }</h2>
                </CardHeader>
                <CardBody>
                    
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
                                        avalId={loader.credit.aval.id}
                                    />
                                </AccordionItem>
                                <AccordionItem 
                                    key="3" 
                                    aria-label="Formulario del credito" 
                                    title="Formulario del Crédito"
                                    subtitle={
                                        <span>
                                        El crédito actual es de <strong>{loader.credit.amount}</strong>
                                        </span>
                                    }
                                >
                                    <CreditRenovateFormSection 
                                        fields={fields.credit}
                                        paymentForgivent={loader.hasPaymentForgivent}
                                        currentDebt={Number(loader.credit.currentDebt)}
                                        paymentAmount={Number(loader.credit.paymentAmount)}
                                        folderId={loader.credit.folder.id}
                                    />
                                </AccordionItem>
                        </Accordion>
                        
                </CardBody>
                <CardFooter>
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
                        isLoading={navigation.state === 'submitting'}
                        isDisabled={navigation.state !== 'idle'}
                        name='_action'
                        value='renovate'
                        >
                        Crear Crédito
                    </Button>
                </CardFooter>
            </Form>
        </Card>
        <CreditPaymentsTable 
            payments={loader.credit.payment_detail}
        />
    </div>)
}