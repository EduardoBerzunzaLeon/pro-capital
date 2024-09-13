import { Input } from "@nextui-org/react"
import { useSearchParams } from "@remix-run/react";

interface Props {
    param: string
    name: string,
    label: string,
    id: string,
    placeholder: string,
    defaultValue?: string,
    className?: string
}

export const InputFilter = ({
    param,  defaultValue, className, ...rest
}: Props) => {
    const [ , setSearchParams] = useSearchParams();

    const handleAgentChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => {
            prev.set(param,event.currentTarget.value)
            return prev;
        })
    }

  return (
          
    <Input 
        { ...rest }
        variant='bordered'
        className={`${className || 'w-full md:max-w-[40%]'}`}
        labelPlacement="outside"
        defaultValue={defaultValue || ''}
        onChange={handleAgentChange}
    />
  )
}