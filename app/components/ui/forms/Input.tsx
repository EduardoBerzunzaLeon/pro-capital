import { FieldMetadata, getInputProps } from "@conform-to/react"
import { Input } from "@nextui-org/react"

type InputTypes = "number" | "color" | "search" | "time" | "text" | "hidden" | "email" | "tel" | "checkbox" | "date" | "datetime-local" | "file" | "month" | "password" | "radio" | "range" | "url" | "week";

interface Props {
    label: string,
    placeholder: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: FieldMetadata<unknown, any, any>,
    inputType?: InputTypes,
    defaultValue?: string,
}

export const InputValidation = ({ inputType, metadata, ...restProps}: Props) => {
  const type = inputType ?? 'text';
  const { key, ...restInputProps} = getInputProps(metadata, { type, ariaAttributes: true });
  return (
    <Input 
        variant='bordered'
        labelPlacement='outside'
        isInvalid={!!metadata.errors}
        color={metadata.errors ? "danger" : "default"}
        errorMessage={metadata.errors}
        key={key}
        {...restInputProps}
        {...restProps}
    />
  )
}