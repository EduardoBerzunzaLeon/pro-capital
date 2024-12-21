import { today, getLocalTimeZone } from "@internationalized/date";
import { Checkbox, DatePicker, Input, Select, SelectItem } from "@nextui-org/react"
import { useEffect, useState } from "react";
import { Autocomplete, Types } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { FieldMetadata, getSelectProps, useInputControl } from "@conform-to/react";
import { InputValidation } from "../forms/Input";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { CreditReadmissionSchema, CreditRenovateSchema } from "~/schemas/creditSchema";
import { calculateAmount, convertDebt } from "~/application";
import { calculateDeductions } from "~/application/utils/credit";

type Fields = FieldMetadata<CreditRenovateSchema, CreditReadmissionSchema, string[]>;

interface Props {
  fields: Fields;
  paymentForgivent: boolean,
  currentDebt: number,
  paymentAmount: number,
  folderId: number
}

const handleChange = (amount: string, type: string) => {

  const amountParsed =  Number(amount);
  if(isNaN(amountParsed)) {
    return { paymentAmount: 0, totalAmount: 0 }; 
  }
  
  const currentAmount = calculateAmount(amountParsed);
  return convertDebt(currentAmount, (type as Types));
}

export const CreditRenovateFormSection = ({ fields, paymentForgivent, paymentAmount, currentDebt, folderId }: Props) => {
  const fetcher = useFetcher<any>();
  const credit = fields.getFieldset();
  const [idFolder, setIdFolder] = useState(folderId);
  const [debt, setDebt] = useState(calculateDeductions(currentDebt, paymentAmount, paymentForgivent));
  const group = useInputControl(credit.group);
  const amount = useInputControl(credit.amount);
  const type = useInputControl(credit.types);
  const isForgivent = useInputControl(credit.paymentForgivent);
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
    fetcher.load(`/folder/group?id=${folderId}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ folderId ])

  useEffect(() => {

    const { paymentAmount, totalAmount } = handleChange(amount.value ?? '', type.value ?? '');
    setPayment(paymentAmount);
    setTotal(totalAmount)

  }, [amount.value, type.value]);



  const handleSelected = ({ id, value }: Autocomplete) => {
    setIdFolder(id);
    folder.change(value);
    fetcher.load(`/folder/group?id=${id}`);
  }

  const handleSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    type.change(e.target.value);
  }

  const handlePaymentForgivent = (isSelected:boolean) => {

    const deduction = calculateDeductions(currentDebt, paymentAmount, isSelected);
    setDebt(deduction);

    isForgivent.change(isSelected ? 'true' : 'false');
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
        defaultValue={{ id: idFolder, value: folder.value ?? '' }}
        selectedItem={{ id: idFolder, value: folder.value ?? '' }}
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
        <Checkbox 
          defaultSelected={paymentForgivent}
          name={credit.paymentForgivent.name}
          value={isForgivent.value}
          isSelected={isForgivent.value === 'true'}
          onValueChange={handlePaymentForgivent}
          className='w-full sm:max-w-[32%]' 
        >Perdonar último pago</Checkbox>
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
          isRequired
          className='w-full sm:max-w-[32%]' 
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
          value={payment+''}
          className='w-full sm:max-w-[32%]' 
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
          value={debt+''}
          variant='bordered'
          className='w-full sm:max-w-[32%]' 
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