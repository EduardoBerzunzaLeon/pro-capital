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
    <div className="flex flex-wrap justify-between gap-2">
       <InputValidation
          label="Nombre(s) del cliente"
          placeholder="Ingresa el/los nombre(s)"
          metadata={client.name}
          isRequired
          className='w-full md:max-w-[32%]' 
      />
      <InputValidation
          label='Primer Apellido del cliente'
          placeholder="Ingresa el primer apellido"
          metadata={client.lastNameFirst}
          className='w-full sm:max-w-[48%] md:max-w-[32%]' 
          isRequired
      />
      <InputValidation
          label='Segundo Apellido del cliente'
          placeholder="Ingresa el segundo apellido"
          className='w-full sm:max-w-[48%] md:max-w-[32%]' 
          metadata={client.lastNameSecond}
      />
      <InputValidation
        label='Telefono del cliente'
        placeholder="Ingresa el telefono"
        className='w-full sm:max-w-[30%]' 
        metadata={client.phoneNumber}
      />
      <InputValidation
          label='Dirección del cliente'
          placeholder="Ingresa la dirección"
          className='w-full sm:max-w-[66%]' 
          metadata={client.address}
          isRequired
      />
      <TextareaValidation 
          label='Referencia del cliente'
          placeholder="Ingresa la referencia"
          metadata={client.reference}
          isRequired
      />
      <TextareaValidation 
          label='Garantías del cliente'
          placeholder="Ingresa las garantías"
          metadata={client.guarantee}
          isRequired
      />
    </div>
  )
}

