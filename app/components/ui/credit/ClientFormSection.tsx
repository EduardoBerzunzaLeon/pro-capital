import { Input, Textarea } from "@nextui-org/react"

export const ClientFormSection = () => {
  return (
    <div>
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Nombre(s) del cliente'
        isRequired
      />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Primer Apellido del cliente'
        isRequired
      />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Segundo Apellido del cliente'
        />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Dirección'
      />
      <Textarea
        label="Referencias"
        variant='bordered'
        labelPlacement="outside"
        placeholder='Ingrese las referencias de la dirección'
      />
      <Textarea
        label="Garantías"
        variant='bordered'
        labelPlacement="outside"
        placeholder='Ingrese las garantías'
      />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Telefono'
      />
    </div>
  )
}

