// import { useState } from "react";

import { Input, Textarea } from "@nextui-org/react"

import { AutocompleteCombobox } from "../forms/Autocomplete"
import { Autocomplete } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { AvalCreditsWarning } from "./AvalCreditsWarning";
import { FieldMetadata, useInputControl } from '@conform-to/react';
import { useEffect } from "react";
import { AvalSchema, CreditCreateSchema } from '../../../schemas/creditSchema';

type Fields = FieldMetadata<AvalSchema, CreditCreateSchema, string[]>

interface Props {
  fields: Fields,
}

interface FetcherData {
  id: number,
  name: string,
  lastNameFirst: string,
  lastNameSecond: string,
  fullname: string,
  address: string,
  reference: string,
  curp: string,
  guarantee: string,
  phoneNumber: string,
  credits: any[],
}

export const AvalFormSection = ({ fields }: Props) => {

  // const [curp, setCurp] = useState('');
  const fetcher = useFetcher<FetcherData>();
  const aval = fields.getFieldset();

  const name = useInputControl(aval.name);
  // const curp = useInputControl(aval.curp);

  console.log({name: name.value})

  const handleSelected = ({ id }: Autocomplete) => {

    if(id === fetcher.data?.id) {
      return;
    }

    fetcher.load(`/aval/${id}`);

  }

  useEffect(() => {

    if(fetcher.data?.id && fetcher.state === 'idle') {
      name.change(fetcher.data.name ?? name.value) 
    }

  }, [fetcher.data?.id, fetcher.state]);

  // console.log(name);


  return (
    <div>
      {(fetcher.data?.credits) && (
        <AvalCreditsWarning 
          credits={fetcher.data.credits}
        />
      )}
      <AutocompleteCombobox 
        keyFetcher='findFolderAutocomplete' 
        actionRoute='/aval/search' 
        label='CURP del aval' 
        comboBoxName='aval' 
        placeholder='Ingresa la CURP' 
        onSelected={handleSelected}
      />
      {/* <InputValidation
          label="Nombre(s) del aval"
          placeholder="Ingresa el/los nombre(s)"
          metadata={aval.name}
      /> */}
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Nombre'
        isRequired
        // key={name.key}
        // name={name.name}
        // defaultValue={name.initialValue}
        value={name.value}
        onValueChange={name.change}
      />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Primer Apellido del aval'
        isRequired
      />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Segundo Apellido del aval'
        />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Dirección'
      />
      <Textarea
        label="Referencias"
        variant='bordered'
        labelPlacement="outside"
        placeholder='Ingrese las referencias de la dirección'
      />
      <Textarea
        label="Garantías"
        variant='bordered'
        labelPlacement="outside"
        placeholder='Ingrese las garantías'
      />
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Telefono'
      />
  </div>
  )
}