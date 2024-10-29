
import { Autocomplete } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { AvalCreditsWarning } from "./AvalCreditsWarning";
import { FieldMetadata, useInputControl } from '@conform-to/react';
import { useEffect, useState } from "react";
import { AvalSchema, CreditCreateSchema } from '../../../schemas/creditSchema';
import { InputValidation } from "../forms/Input";
import { TextareaValidation } from "../forms/Textarea";
import {AutocompleteValidation } from "../forms/AutocompleteValidation";

type Fields = FieldMetadata<AvalSchema, CreditCreateSchema, string[]>

interface Props {
  fields: Fields,
  avalId?: number
}

interface Credit {
  status: string,
  client: {
      fullname: string
  }
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
  credits: Credit[],
}

export const AvalFormSection = ({ fields, avalId }: Props) => {

  // const [curp, setCurp] = useState('');
  const fetcher = useFetcher<FetcherData>();
  const aval = fields.getFieldset();

  const curp = useInputControl(aval.curp);
  const [idAval, setIdAval] = useState(avalId ?? 0);
  const name = useInputControl(aval.name);
  const lastNameFirst = useInputControl(aval.lastNameFirst);
  const lastNameSecond = useInputControl(aval.lastNameSecond);
  const address = useInputControl(aval.address);
  const reference = useInputControl(aval.reference);
  const guarantee = useInputControl(aval.guarantee);
  const phoneNumber = useInputControl(aval.phoneNumber);

  const handleSelected = ({ id, value }: Autocomplete) => {
    setIdAval(id);
    curp.change(value);
  }

  useEffect(() => {
    if(idAval !== fetcher.data?.id) {
      fetcher.load(`/aval/${idAval}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAval])

  const handleChange = (value: string) => {
    if(!value) {
      name.change('');
      lastNameFirst.change('');
      lastNameSecond.change('');
      address.change('');
      reference.change('');
      guarantee.change('');
      phoneNumber.change('');
    }
  }

  useEffect(() => {

    if(fetcher.data?.id && fetcher.state === 'idle') {
      name.change(fetcher.data.name);
      lastNameFirst.change(fetcher.data.lastNameFirst);
      lastNameSecond.change(fetcher.data.lastNameSecond);
      address.change(fetcher.data.address);
      reference.change(fetcher.data.reference);
      phoneNumber.change(fetcher.data.phoneNumber);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data?.id, fetcher.state]);

  // console.log(name);
  return (
    <div>
      {(fetcher.data?.credits) && (
        <AvalCreditsWarning 
          credits={fetcher.data.credits}
        />
      )}
      <AutocompleteValidation 
        keyFetcher='findAvalCurpAutocomplete'
        actionRoute='/aval/search'
        label='CURP del aval'
        comboBoxName='aval'
        placeholder='Ingresa la CURP'
        onSelected={handleSelected} 
        metadata={aval.curp}      
        // value={curp.value ?? ''}
        onValueChange={curp.change}
        selectedItem={{ id: idAval, value: curp.value ?? '' }}
        onChange={handleChange}
      />
      <InputValidation
          label="Nombre(s) del aval"
          placeholder="Ingresa el/los nombre(s)"
          metadata={aval.name}
          value={name.value ?? ''}
          onValueChange={name.change}
      />
      <InputValidation
          label='Primer Apellido del aval'
          placeholder="Ingresa el primer apellido"
          metadata={aval.lastNameFirst}
          value={lastNameFirst.value ?? ''}
          onValueChange={lastNameFirst.change}
      />
      <InputValidation
          label='Segundo Apellido del aval'
          placeholder="Ingresa el segundo apellido"
          metadata={aval.lastNameSecond}
          value={lastNameSecond.value ?? ''}
          onValueChange={lastNameSecond.change}
      />
      <InputValidation
        label='Telefono del aval'
        placeholder="Ingresa el telefono"
        metadata={aval.phoneNumber}
        value={phoneNumber.value ?? ''}
        onValueChange={phoneNumber.change}
      />
      <InputValidation
          label='Dirección del aval'
          placeholder="Ingresa la dirección"
          metadata={aval.address}
          value={address.value ?? ''}
          onValueChange={address.change}
      />
      <TextareaValidation 
          label='Referencia del aval'
          placeholder="Ingresa la referencia"
          metadata={aval.reference}
          value={reference.value ?? ''}
          onValueChange={reference.change}
      />
      <TextareaValidation 
          label='Garantías del aval'
          placeholder="Ingresa las garantías"
          metadata={aval.guarantee}
      />
  </div>
  )
}