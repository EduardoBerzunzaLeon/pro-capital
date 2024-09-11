import { Fragment, useEffect, useState } from "react";
import clsx from 'clsx';
import { Autocomplete } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { useFetcher } from "@remix-run/react";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { Input, Spinner } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";

export const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
    a?.id === b?.id;

export const initialValue = { id: 0, value: ''};

interface Props {
    keyFetcher: string,
    actionRoute: string,
    label: string,
    comboBoxName: string,
    placeholder: string,
    selectedItem?: Autocomplete, 
    onSelected?: (value: Autocomplete) =>  void,
    onChange?: (value: string)  => void
}

export const AutocompleteCombobox = ({ 
    keyFetcher, 
    actionRoute, 
    label, 
    comboBoxName, 
    placeholder, 
    selectedItem,
    onSelected, 
    onChange 
}: Props) => {

    const [query, setQuery] = useState('');
    const [displayValue, setDisplayValue] = useState('');
    const [selected, setSelected] = useState<Autocomplete | undefined>({...initialValue});
    const { submit, data, state } = useFetcher<HandlerSuccess<Autocomplete[]>>({ key: keyFetcher });

    const isControlled = !!selectedItem && !!onSelected;

    // TODO: mover esto al handlechange a ver que sucede 
    useEffect(() => {
        console.log({query})
        submit({ data: query }, { action: actionRoute });
   }, [actionRoute, query, submit]);


    // TODO: Hay un brinco mientras espera que se ejecute este useeffect en los formularios de edicion  
   useEffect(() => {
    if(selectedItem?.value && selectedItem.value.toLowerCase() !== displayValue.toLowerCase()) {
        setDisplayValue(selectedItem.value)
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedItem])

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    !!onChange && onChange(event.target.value);
  }

  const handleSelected = (value: NoInfer<Autocomplete> | null) =>{
    const newValue = value ?? { id: 0, value: '' };
    if(isControlled) { 
        onSelected(newValue);
        return;
    }

    setDisplayValue(newValue.value);
    setSelected(newValue);
    !!onSelected && onSelected(newValue);
  }
    return (  
            <Combobox
                name={comboBoxName} 
                value={isControlled ? selectedItem : selected} 
                onChange={handleSelected} 
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
                    as={Fragment}
                >
                    <Input 
                        variant='bordered'
                        labelPlacement='outside'
                        label={label}
                        placeholder={placeholder}
                        onChange={(e) => setDisplayValue(e.target.value)}
                        value={displayValue}
                        endContent={
                            (state !== 'idle' && (<Spinner size='sm' />))
                        }
                    />
                </ComboboxInput>
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
            
            </Combobox>)
}