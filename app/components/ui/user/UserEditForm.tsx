import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react"
import { UpdateUserSchema } from "~/schemas/userSchema";
import { InputValidation } from "../forms/Input";
import { Card, CardHeader, Select, SelectItem, CardBody, Button } from '@nextui-org/react';

interface Props {
    id: number,
    email: string,
    username: string,
    name: string,
    lastNameFirst: string,
    lastNameSecond?: string,
    address: string,
    sex: string,
}
export const UserEditForm = ({
    id,
    email,
    username,
    name,
    lastNameFirst,
    lastNameSecond,
    address,
    sex,
}: Props) => {

    const { Form, state } = useFetcher();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: UpdateUserSchema });
        },
        defaultValue: {
            email,
            username,
            name,
            lastNameFirst,
            lastNameSecond,
            address,
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onBlur',
    }); 
    
  return (
    <Card className="max-w-[600px] min-w-[300px]">
        <Form 
            method='post'
            { ...getFormProps(form) }
            action={`/users/${id}/update`}
        >
            <CardHeader>
                <h2>Actualizar datos personales</h2>
            </CardHeader>
            <CardBody>
                    <InputValidation
                        label="Nombre(s)"
                        placeholder="Ingresa el/los nombre(s)"
                        metadata={fields.name}
                    />
                    <InputValidation
                        label="Primer Apellido"
                        placeholder="Ingresa el primer apellido"
                        metadata={fields.lastNameFirst}
                    />
                    <InputValidation
                        label="Segundo Apellido"
                        placeholder="Ingresa el segundo apellido"
                        metadata={fields.lastNameSecond}
                    />
                    <InputValidation
                        label="Nombre de usuario"
                        placeholder="Ingresa el nombre de usuario"
                        metadata={fields.username}
                    />
                    <InputValidation
                        label="Correo electronico"
                        placeholder="Ingresa el correo electronico"
                        inputType='email'
                        metadata={fields.email}
                    />
                    <InputValidation
                        label="Dirección"
                        placeholder="Ingresa la dirección"
                        metadata={fields.address}
                    />
                    <Select
                                items={[{key: 'masculino', value:'MASCULINO'}, {key: 'femenino', value:'FEMENINO'}]}
                                label="Genero"
                                {...getSelectProps(fields.sex)}
                                isInvalid={!!fields.sex.errors}
                                color={fields.sex.errors ? "danger" : "default"}
                                errorMessage={fields.sex.errors}
                                placeholder="Seleccione un genero"
                                labelPlacement="outside"
                                variant="bordered"
                                defaultSelectedKeys={[sex]}
                            >
                                {
                            (sex) => <SelectItem key={sex.key} textValue={sex.value}>
                                <div className="flex items-center justify-between">
                                    <span className='text-center'>{sex.value}</span>
                                </div>
                            </SelectItem>
                        }
                    </Select>
            </CardBody>
            <CardHeader>
                <Button 
                    color="primary" 
                    type='submit' 
                    name='_action' 
                    value='updatePersonalData' 
                    isLoading={state !== 'idle'}
                    isDisabled={state !== 'idle'}
                    >
                    Actualizar
                </Button>
            </CardHeader>
        </Form>
    </Card>
  )
}
