import { today, getLocalTimeZone } from "@internationalized/date";
import { Checkbox, DatePicker, Input, Select, SelectItem } from "@nextui-org/react"
import { useEffect, useState } from "react";
import { Autocomplete } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { FieldMetadata, getSelectProps, useInputControl } from "@conform-to/react";
import { CreditSchema, CreditCreateSchema } from "~/schemas/creditSchema";
import { InputValidation } from "../forms/Input";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";

type Types = 'NORMAL' | 'EMPLEADO' | 'LIDER';

type Fields = FieldMetadata<CreditSchema, CreditCreateSchema, string[]>;

interface Props {
  fields: Fields;
  paymentForgivent: boolean,
  currentDebt: number,
  folderId: number
}

const convertDebt = (amount: number, type: Types = 'NORMAL') => {
  const debt = { 
    paymentAmount: amount / 10, 
    totalAmount: 0 
  }

  const types = {
    'NORMAL': 15,
    'EMPLEADO': 12,
    'LIDER': 10,
  }

  const weeks = type in types ? types[type] : 15;
  debt.totalAmount = debt.paymentAmount * weeks;

  return debt;
}

const handleChange = (amount: string, type: string) => {

  const amountParsed =  Number(amount);
  if(isNaN(amountParsed)) {
    return { paymentAmount: 0, totalAmount: 0 }; 
  }

  const data =  {
    amount: amountParsed,
    type
  }
  
  return convertDebt(data.amount, (data.type as Types));
}

export const CreditRenovateFormSection = ({ fields, paymentForgivent, currentDebt, folderId }: Props) => {
  const fetcher = useFetcher<any>();
  const credit = fields.getFieldset();
  const group = useInputControl(credit.group);
  const amount = useInputControl(credit.amount);
  const type = useInputControl(credit.types);
  const folder = useInputControl(credit.folder);
  const [payment, setPayment] = useState(0);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {

    const { paymentAmount, totalAmount } = handleChange(amount.value ?? '', type.value ?? '');

    setPayment(paymentAmount);
    setTotal(totalAmount)

  }, [amount.value, type.value]);

  useEffect(() => {
    fetcher.load(`/folder/group?id=${folderId}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ folderId ])

  const handleSelected = ({ id }: Autocomplete) => {
    fetcher.load(`/folder/group?id=${id}`);
  }


  const handleSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    type.change(e.target.value);
  }

  return (
    <div>
      <AutocompleteValidation 
        keyFetcher='findFolderAutocomplete' 
        actionRoute='/folder/search' 
        label='Carpeta' 
        comboBoxName='folder' 
        placeholder='Ingresa la carpeta' 
        onSelected={handleSelected}
        metadata={credit.folder}      
        onValueChange={folder.change}
      />
        <InputValidation
          label="Grupo"
          placeholder="Ingresa el grupo"
          metadata={credit.group}
          value={group.value ?? ''}
          onValueChange={group.change}
        />
        <Checkbox defaultSelected={paymentForgivent}>Perdonar último pago</Checkbox>
      <Select 
          variant='bordered'
          labelPlacement="outside"
          label='Tipo de credito'
          onChange={handleSelectedType}
          selectedKeys={[type.value || 'NORMAL']}
          disallowEmptySelection
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
          value={payment+''}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
       <Input
          label="Deuda actual"
          placeholder="0.00"
          labelPlacement="outside"
          isDisabled
          value={currentDebt}
          variant='bordered'
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
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <DatePicker 
            label="Fecha de asignación del crédito" 
            variant='bordered' 
            id='creditAt'
            key={credit.creditAt.key}
            name={credit.creditAt.name}
            isInvalid={!!credit.creditAt.errors}
            errorMessage={credit.creditAt.errors}
            defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })}
            granularity="day"
        />
    </div>
  )
}