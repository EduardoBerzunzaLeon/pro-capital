import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react"
import { UpdateUserSchema } from "~/schemas/userSchema";
import { InputValidation } from "../forms/Input";
import { SelectRoles } from "../role/SelectRoles";

interface Props {
    id: number,
    email: string,
    username: string,
    name: string,
    lastNameFirst: string,
    lastNameSecond?: string,
    isActive: boolean,
    role: { id: number, role: string },
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
    isActive,
    role,
    address,
    sex,
}: Props) => {

    const { Form } = useFetcher();

        
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
    <Form 
        method='post'
        { ...getFormProps(form) }
    >
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
        <SelectRoles 
            {...getSelectProps(fields.role)}
            isInvalid={!!fields.role.errors}
            color={fields.role.errors ? "danger" : "default"}
            errorMessage={fields.role.errors}
            defaultSelectedKeys={[role.id]}
        />
    </Form>
  )
}
