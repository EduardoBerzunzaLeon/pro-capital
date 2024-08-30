import { Input } from "@nextui-org/react"

interface Props {
    label: string,
    placeholder: string,
    name: string,
    defaultValue?: string,
    key?: string,
    errors?: string[]
}

export const InputValidation = ({ errors, ...restProps}: Props) => {
  return (
    <Input 
        variant='bordered'
        labelPlacement='outside'
        isInvalid={!!errors}
        color={errors ? "danger" : "default"}
        errorMessage={errors}
        {...restProps}
    />
  )
}
