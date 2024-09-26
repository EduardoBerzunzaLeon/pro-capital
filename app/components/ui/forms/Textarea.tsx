import { FieldMetadata, getTextareaProps } from "@conform-to/react"
import { Textarea } from "@nextui-org/react"

interface Props {
    label: string,
    placeholder: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: FieldMetadata<unknown, any, any>,
    value?: string,
    onValueChange?: (value: string) => void,
    defaultValue?: string,
}

export const TextareaValidation = ({ metadata, ...restProps}: Props) => {
  const { key, ...restInputProps} = getTextareaProps(metadata, { ariaAttributes: true });
  return (
    <Textarea 
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
