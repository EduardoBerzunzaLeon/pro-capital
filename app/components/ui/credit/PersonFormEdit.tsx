import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { useState } from "react"
import { action } from "~/routes/_app+/clients/edit/$clientId/_index";
import { clientUpdateSchema } from "~/schemas";
import { InputValidation } from "../forms/Input";

interface Props {
    id: number,
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    address: string,
    phoneNumber: string,
    curp: string,
    reference: string,
    urlAction: string,
    title: string,
}


export const PersonFormEdit = ({ 
    id,
    name,
    lastNameFirst,
    lastNameSecond,
    address,
    phoneNumber,
    curp,
    reference,
    urlAction,
    title
}: Props) => {

    const fetcher = useFetcher<typeof action>();
    const [ isEditable, setIsEditable ] = useState(false);

    const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: clientUpdateSchema });
      },
      defaultValue: {
        name,
        lastNameFirst,
        lastNameSecond,
        address,
        phoneNumber,
        curp,
        reference,
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onInput',
  }); 

    const handleCancel = () => {
        setIsEditable(false);
        form.reset();
    }

    const handleEnableEdit = () => {
        setIsEditable(true);
    }

  return (
        <fetcher.Form
          method='POST' 
          action={`/${urlAction}/edit/${id}`}
          { ...getFormProps(form) }
        >
        <Card>
          <CardHeader className='flex gap-2'>
            {title}

            { isEditable && (<Chip variant='bordered' color='warning'>En edición</Chip>)}
          </CardHeader>
          <CardBody>
              <InputValidation
                  label="Nombre"
                  placeholder="Ingresa el nombre"
                  metadata={fields.name}
                  isReadOnly={!isEditable}
                  />
              <InputValidation
                label='Primer Apellido'
                metadata={fields.lastNameFirst} 
                isReadOnly={!isEditable}
                placeholder="Ingresa el primer apellido"
              /> 
              <InputValidation
                label='Segundo Apellido'
                metadata={fields.lastNameSecond} 
                isReadOnly={!isEditable}
                placeholder="Ingresa el segundo apellido"
              /> 
              <InputValidation
                label='Dirección'
                metadata={fields.address} 
                isReadOnly={!isEditable}
                placeholder="Ingresa la dirección"
              /> 
              <InputValidation
                label='Telefono'
                metadata={fields.phoneNumber} 
                isReadOnly={!isEditable}
                placeholder="Ingresa el telefono"
              /> 
              <InputValidation
                label='CURP'
                metadata={fields.curp} 
                isReadOnly={!isEditable}
                placeholder="Ingresa la CURP"
              /> 
              <InputValidation
                label='referencia'
                metadata={fields.reference} 
                isReadOnly={!isEditable}
                placeholder="Ingresa la referencia"
              /> 
          </CardBody>
          <CardFooter className='flex gap-2'>
            {
              isEditable  
                    ? (
                      <>
                            <Button variant="ghost" color='danger' onPress={handleCancel}>
                                Cancelar Edición
                            </Button>
                            <Button 
                              variant="ghost" 
                              color='success'
                              type='submit'
                              name='_action'
                              value='update'
                              isLoading={fetcher.state !== 'idle'}
                              isDisabled={fetcher.state !== 'idle'}
                            >
                                Editar
                            </Button>
                        </>
                    )
                    : (
                      <Button 
                        variant="ghost" 
                        color='primary'
                        onPress={handleEnableEdit}
                       >
                            Habilitar Edición
                        </Button>
                    )
                  }
          </CardFooter>
        </Card>
      </fetcher.Form>
  )
}