import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, Accordion, AccordionItem, Button, CardFooter } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import { handlerError } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";
import { permissions } from "~/application";
import { ClientFormSection, AvalFormSection, CreditFormSection } from "~/components/ui";
import { creditCreateSchema } from "~/schemas";

export const loader: LoaderFunction = async ({ request, params }) => {
     await Service.auth.requirePermission(request, permissions.credits.permissions.add_additional);
    try {
        return await Service.credit.validationToAdditional(params.curp);
    } catch (err) {
        console.log(err);
        const  { error } = handlerError(err);
        return redirectWithError('/clients', error);
    }
}

export const action: ActionFunction = async ({ request, params }) => {
    const user = await Service.auth.requirePermission(request, permissions.credits.permissions.add_additional);
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        // console.log({data, params});
        await Service.credit.additional(user.id, formData, params?.curp);
        return redirectWithSuccess('/clients', 'El crédito se ha creado con éxito 🎉');
    } catch (error) {
        console.log({error});
        return handlerErrorWithToast(error, { data });
    }
}

export const handle = {
    breadcrumb: (data: string) => {
        return [
            {
              href: '/clients',
              label: 'Créditos',
              startContent: <FaUsers />,
            },
            {
                href: `/users/${data}/additional`,
                label: `Adicionar crédito`,
                startContent: <FaUserPlus />,
            },
        ]
    }
}

export default function AdditionalFormPage () {
    const loader = useLoaderData<any>();
    const navigate = useNavigate();
    const navigation = useNavigation();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: creditCreateSchema });
        },
        defaultValue: {
            client: { ...loader },
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
      }); 

    const handleCancel = () => {
        navigate('/clients');
    }


    return ( 
    <Card className="w-full">
        <Form
            method="post" 
            { ...getFormProps(form) }
            className="w-full"
        >
            <CardHeader>
                <h2>Adicional crédito al cliente {loader.fullname}</h2>
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
                    >
                    Crear Crédito
                </Button>
            </CardFooter>
        </Form>
    </Card>)
}
