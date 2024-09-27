
import { Autocomplete } from "~/.server/interfaces";
import { useFetcher } from "@remix-run/react";
import { AvalCreditsWarning } from "./AvalCreditsWarning";
import { FieldMetadata, useInputControl } from '@conform-to/react';
import { useEffect } from "react";
import { AvalSchema, CreditCreateSchema } from '../../../schemas/creditSchema';
import { InputValidation } from "../forms/Input";
import { TextareaValidation } from "../forms/Textarea";
import {AutocompleteValidation } from "../forms/AutocompleteValidation";

type Fields = FieldMetadata<AvalSchema, CreditCreateSchema, string[]>

interface Props {
  fields: Fields,
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

export const AvalFormSection = ({ fields }: Props) => {

  // const [curp, setCurp] = useState('');
  const fetcher = useFetcher<FetcherData>();
  const aval = fields.getFieldset();

  const curp = useInputControl(aval.curp);
  const name = useInputControl(aval.name);
  const lastNameFirst = useInputControl(aval.lastNameFirst);
  const lastNameSecond = useInputControl(aval.lastNameSecond);
  const address = useInputControl(aval.address);
  const reference = useInputControl(aval.reference);
  // const guarantee = useInputControl(aval.guarantee);
  const phoneNumber = useInputControl(aval.phoneNumber);

  const handleSelected = ({ id }: Autocomplete) => {

    if(id === fetcher.data?.id) {
      return;
    }
    fetcher.load(`/aval/${id}`);
  }

  const handleChange = (value: string) => {
    console.log({value});
  }

  useEffect(() => {

    if(fetcher.data?.id && fetcher.state === 'idle') {
      name.change(fetcher.data.name);
      lastNameFirst.change(fetcher.data.lastNameFirst);
      lastNameSecond.change(fetcher.data.lastNameSecond);
      address.change(fetcher.data.address);
      reference.change(fetcher.data.reference);
      // TODO: preguntar si cargo las garantias por defecto
      // guarantee.change(fetcher.data.guarantee);
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
          // value={guarantee.value ?? ''}
          // onValueChange={guarantee.change}
      />
      <InputValidation
        label='Telefono del aval'
        placeholder="Ingresa el telefono"
        metadata={aval.phoneNumber}
        value={phoneNumber.value ?? ''}
        onValueChange={phoneNumber.change}
      />
  </div>
  )
}