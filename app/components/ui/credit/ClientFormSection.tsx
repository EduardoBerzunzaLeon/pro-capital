import { FieldMetadata } from "@conform-to/react"
import { ClientSchema, CreditCreateSchema } from "~/schemas/creditSchema"
import { InputValidation } from "../forms/Input"
import { TextareaValidation } from "../forms/Textarea"


type Fields = FieldMetadata<ClientSchema, CreditCreateSchema, string[]>

interface Props {
  fields: Fields,
}

export const ClientFormSection = ({ fields }: Props) => {

  const client = fields.getFieldset();

  return (
    <div>
       <InputValidation
          label="Nombre(s) del cliente"
          placeholder="Ingresa el/los nombre(s)"
          metadata={client.name}
      />
      <InputValidation
          label='Primer Apellido del cliente'
          placeholder="Ingresa el primer apellido"
          metadata={client.lastNameFirst}
      />
      <InputValidation
          label='Segundo Apellido del cliente'
          placeholder="Ingresa el segundo apellido"
          metadata={client.lastNameSecond}
      />
      <InputValidation
        label='Telefono del cliente'
        placeholder="Ingresa el telefono"
        metadata={client.phoneNumber}
      />
      <InputValidation
          label='Dirección del cliente'
          placeholder="Ingresa la dirección"
          metadata={client.address}
      />
      <TextareaValidation 
          label='Referencia del cliente'
          placeholder="Ingresa la referencia"
          metadata={client.reference}
      />
      <TextareaValidation 
          label='Garantías del cliente'
          placeholder="Ingresa las garantías"
          metadata={client.guarantee}
      />
    </div>
  )
}

