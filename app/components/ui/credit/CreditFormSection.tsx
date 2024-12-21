import { today, getLocalTimeZone } from "@internationalized/date";
import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react"
import { useEffect } from "react";
import { Autocomplete } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { FieldMetadata, getSelectProps, useInputControl } from "@conform-to/react";
import { CreditSchema, CreditCreateSchema } from "~/schemas/creditSchema";
import { InputValidation } from "../forms/Input";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { useCalculateDebt } from "~/application";

type Fields = FieldMetadata<CreditSchema, CreditCreateSchema, string[]>;

interface Props {
  fields: Fields;
}


export const CreditFormSection = ({ fields }: Props) => {
  const fetcher = useFetcher<any>();
  const credit = fields.getFieldset();
  const group = useInputControl(credit.group);
  const amount = useInputControl(credit.amount);
  const type = useInputControl(credit.types);
  const folder = useInputControl(credit.folder);

  const { payment, total }  = useCalculateDebt(amount.value, type.value)

  useEffect(() => {

    if(fetcher.state === 'idle' && fetcher.data?.status === 'success' ) {
        const groups = fetcher.data?.serverData?.group.groups;
        if(groups.length === 1 ) {
            group.change(groups[0].name)
        } else {
          group.change('1')
        }

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const handleSelected = ({ id }: Autocomplete) => {
    fetcher.load(`/folder/group?id=${id}`);
  }

  const handleSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    type.change(e.target.value);
  }


  return (
    <div className='w-[98%] flex flex-wrap justify-between gap-2'>
      <AutocompleteValidation 
        keyFetcher='findFolderAutocomplete' 
        actionRoute='/folder/search' 
        label='Carpeta' 
        comboBoxName='folder' 
        placeholder='Ingresa la carpeta' 
        onSelected={handleSelected}
        metadata={credit.folder}      
        onValueChange={folder.change}
        className='w-full sm:max-w-[32%]' 
        isRequired
      />
        <InputValidation
          label="Grupo"
          placeholder="Ingresa el grupo"
          metadata={credit.group}
          value={group.value ?? ''}
          onValueChange={group.change}
          isRequired
          className='w-full sm:max-w-[32%]' 
        />
        <DatePicker 
            label="Fecha de asignación" 
            variant='bordered' 
            id='creditAt'
            key={credit.creditAt.key}
            name={credit.creditAt.name}
            isInvalid={!!credit.creditAt.errors}
            errorMessage={credit.creditAt.errors}
            defaultValue={today(getLocalTimeZone())}
            granularity="day"
            labelPlacement="outside"
            isRequired
            className='w-full sm:max-w-[32%]' 
        />
      <Select 
          variant='bordered'
          labelPlacement="outside"
          label='Tipo de credito'
          onChange={handleSelectedType}
          selectedKeys={[type.value || 'NORMAL']}
          disallowEmptySelection
          className='w-full sm:max-w-[32%]' 
          isRequired
          {...getSelectProps(credit.types)}
      >
        <SelectItem key='NORMAL'>Normal</SelectItem>
        <SelectItem key='EMPLEADO'>Empleado</SelectItem>
        <SelectItem key='LIDER'>Lider</SelectItem>
      </Select>
        <InputValidation
          label="Cantidad prestada"
          inputType='number'
          placeholder="Ingresa la cantidad prestada"
          metadata={credit.amount}
          value={amount.value ?? ''}
          onValueChange={amount.change}
          className='w-full sm:max-w-[32%]' 
          isRequired
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
       <Input
          label="Pagos Semanal"
          placeholder="0.00"
          labelPlacement="outside"
          variant='bordered'
          isDisabled
          className='w-full sm:max-w-[32%]' 
          value={payment+''}
          
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
       <Input
          label="Total a pagar"
          placeholder="0.00"
          labelPlacement="outside"
          isDisabled
          value={total+''}
          variant='bordered'
          className='w-full sm:max-w-[32%]' 
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        
    </div>
  )
}