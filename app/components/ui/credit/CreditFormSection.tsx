import { today, getLocalTimeZone } from "@internationalized/date";
import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react"
import { useEffect, useState } from "react";
import { Autocomplete, Selection } from "~/.server/interfaces";
import { AutocompleteCombobox } from "../forms/Autocomplete";
import { useFetcher } from "@remix-run/react";

type Types = 'NORMAL' | 'EMPLEADO' | 'LIDER';

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

const handleChange = (amount: string, type: Selection) => {

  const amountParsed =  Number(amount);
  if(isNaN(amountParsed)) {
    return { paymentAmount: 0, totalAmount: 0 }; 
  }

  if(typeof type === 'string')  return { paymentAmount: 0, totalAmount: 0 };

  const typeArray = Array.from(type);

  const data =  {
    amount: amountParsed,
    type: typeArray.length !== 1 ? 'NORMAL' : typeArray[0]
  }

  return convertDebt(data.amount, (data.type as Types));
}


export const CreditFormSection = () => {
  const fetcher = useFetcher<any>();
  const [assignAt, setAssignAt] = useState(today(getLocalTimeZone()));
  const [payment, setPayment] = useState(0);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState<Selection>(new Set([]));
  const [amount, setAmount] = useState('0');
  const [group, setGroup] = useState('0');

  useEffect(() => {

    const { paymentAmount, totalAmount } = handleChange(amount, type);

    setPayment(paymentAmount);
    setTotal(totalAmount)

  }, [type, amount])

  useEffect(() => {

    if(fetcher.state === 'idle' && fetcher.data?.status === 'success' ) {
        const groups = fetcher.data?.serverData?.group.groups;
        if(groups.length === 1 ) {
            setGroup(groups[0].name)
        } else {
          setGroup('1')
        }

    }
  }, [fetcher.state, fetcher.data]);

  const handleSelected = ({ id }: Autocomplete) => {
    fetcher.load(`/folder/group?id=${id}`);
  }

  console.log({ data: fetcher.data });

  return (
    <div>
      <AutocompleteCombobox 
        keyFetcher='findFolderAutocomplete' 
        actionRoute='/folder/search' 
        label='Carpeta' 
        comboBoxName='folder' 
        placeholder='Ingresa la carpeta' 
        onSelected={handleSelected}
      />
        <Input
          type="number"
          label="Grupo"
          placeholder="0"
          labelPlacement="outside"
          variant='bordered'
          value={group}
          onValueChange={setGroup}
        />
      <Select 
          variant='bordered'
          labelPlacement="outside"
          label='Tipo de credito'
          onSelectionChange={setType}
          selectedKeys={type}
          defaultSelectedKeys={new Set(['NORMAL'])}
          disallowEmptySelection
      >
        <SelectItem key='NORMAL'>Normal</SelectItem>
        <SelectItem key='EMPLEADO'>Empleado</SelectItem>
        <SelectItem key='LIDER'>Lider</SelectItem>
      </Select>
      {/* TODO: IMPLEMENT FOLDER AUTOCOMPLETE, AND PICK FOLDER GET LAST GROUP */}

      <Input
          type="number"
          label="Cantidad Prestada"
          placeholder="0.00"
          labelPlacement="outside"
          variant='bordered'
          value={amount}
          onValueChange={setAmount}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
       <Input
          type="number"
          label="Pagos Semanal"
          placeholder="0.00"
          labelPlacement="outside"
          variant='bordered'
          isReadOnly
          value={payment+''}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
       <Input
          type="number"
          label="Total a pagar"
          placeholder="0.00"
          labelPlacement="outside"
          isReadOnly
          value={total+''}
          variant='bordered'
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <DatePicker 
          label="Dia de asignación del crédito" 
          variant='bordered' 
          name='assignAt'
          id='assignAt'
          value={assignAt}
          onChange={setAssignAt}
          granularity="day"
        />
    </div>
  )
}