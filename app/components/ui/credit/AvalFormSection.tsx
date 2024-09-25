// import { useState } from "react";

import { Input, Textarea } from "@nextui-org/react"

import { AutocompleteCombobox } from "../forms/Autocomplete"
import { Autocomplete } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { AvalCreditsWarning } from "./AvalCreditsWarning";
import { FieldMetadata } from '@conform-to/react';
import { InputValidation } from "../forms/Input";

type Fields = FieldMetadata<{ name: string }, {
  aval: {
      name: string;
  };
}, string[]>

interface Props {
  fields: any,
  setName: any
}

export const AvalFormSection = ({ fields, setName }: Props) => {

  // const [curp, setCurp] = useState('');
  const fetcher = useFetcher();

  console.log({data: fetcher.data});

  const handleSelected = ({ id }: Autocomplete) => {

    if(id === fetcher.data?.id) {
      return;
    }

    fetcher.load(`/aval/${id}`);

    // setCurp(value.value)
  }


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
          metadata={fields}
      /> */}
      <Input 
        variant='bordered'
        labelPlacement="outside"
        label='Nombre'
        isRequired
        value={fields}
        onValueChange={setName}
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