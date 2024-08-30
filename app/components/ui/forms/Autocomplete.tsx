import { forwardRef, useEffect, useState } from "react";
import clsx from 'clsx';
import { Autocomplete } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { useFetcher } from "@remix-run/react";
import { Field, Label, Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { Spinner } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";

export const AutocompleteInput = forwardRef(function MyInputs(props, ref: React.ForwardedRef<HTMLInputElement | null>) {
    return <input 
    {...props} 
    ref={ref} 
    placeholder="Ingresa la localidad"  
    className={clsx(
              'w-full mt-1  rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
  />
})

// TODO: mejorar el autocomplete para que sea dinamico

export const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
    a?.id === b?.id;


export const initialValue = { id: 0, value: ''};

interface Props {
    keyFetcher: string,
    actionRoute: string,
    label: string,
    comboBoxName: string,
    onSelected?: (value: Autocomplete) =>  void,
    onChange?: (value: string)  => void
}

export const AutocompleteCombobox = ({ keyFetcher, actionRoute, label, comboBoxName, onSelected, onChange }: Props) => {

    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Autocomplete | undefined>({...initialValue});
    const { submit, data, state } = useFetcher<HandlerSuccess<Autocomplete[]>>({ key: keyFetcher });

    useEffect(() => {
        submit({ data: query }, { action: actionRoute });
   }, [actionRoute, query, submit])

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    // TODO: CREATE A CALLBACK for this methods
    !!onChange && onChange(event.target.value);
  }

    return (  
        <Field>
            <Label className='m-2'>{label}</Label>
            <Combobox
                name={comboBoxName} 
                value={selected} 
                onChange={(value) => {
                    const newValue = value ?? {id: 0, value: ''};
                    setSelected(newValue);
                    !!onSelected && onSelected(newValue)
                }} 
                by={compareAutocomplete}
                onClose={() => {
                    setQuery('')
                }}
            >
                <div className="relative">
                
                <ComboboxInput
                    displayValue={(data) => {
                    return (data as Autocomplete)?.value;
                    }}
                    onChange={handleChange}
                    as={AutocompleteInput}
                />
                
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    { state !== 'idle' && <Spinner size='sm' />}
                </ComboboxButton>
                </div>
                        {(state === 'idle') ?(
                                <ComboboxOptions
                                    anchor="bottom"
                                    transition
                                    className={clsx(
                                        'capitalize w-[var(--input-width)] rounded-xl border z-50  border-white/5 bg-current p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                                    )}
                                >
                                {data?.serverData?.map((data) => (
                                    <ComboboxOption
                                        key={data.id}
                                        value={data}
                                        className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                    >
                                        <FaCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                        <div className="text-sm/6 text-white">{data.value}</div>
                                    </ComboboxOption>
                                ))}
                                </ComboboxOptions>
                        ): null}
            
            </Combobox>
        </Field>)
}