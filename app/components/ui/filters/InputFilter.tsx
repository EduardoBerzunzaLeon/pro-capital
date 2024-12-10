import { Input } from "@nextui-org/react"
import { useSearchParams } from "@remix-run/react";
import { FaSearch } from "react-icons/fa";

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
    param, className, ...rest
}: Props) => {
    const [params , setSearchParams] = useSearchParams();

    const handleChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => {
            prev.set(param,event.currentTarget.value)
            return prev;
        });
    }

    const handleClear = () => {
        setSearchParams(prev => {
            prev.delete(param)
            return prev;
        })
    }

  return (
          
    <Input 
        { ...rest }
        variant='bordered'
        isClearable
        className={`${className || 'w-full md:max-w-[40%]'}`}
        labelPlacement="outside"
        defaultValue={params.get(param) || ''}
        onChange={handleChange}
        onClear={handleClear}
        startContent={<FaSearch />}
    />
  )
}