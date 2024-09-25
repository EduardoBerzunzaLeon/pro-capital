import { today, getLocalTimeZone } from "@internationalized/date";
import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react"
import { useState } from "react";

export const CreditFormSection = () => {
  const [assignAt, setAssignAt] = useState(today(getLocalTimeZone()));
  return (
    <div>
      <Select 
          variant='bordered'
          labelPlacement="outside"
          label='Tipo de credito'
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
          endContent={
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
          endContent={
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
          variant='bordered'
          endContent={
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