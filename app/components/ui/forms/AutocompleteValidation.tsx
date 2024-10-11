import { Fragment, useEffect, useState } from "react";
import clsx from 'clsx';
import { Autocomplete } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { useFetcher } from "@remix-run/react";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { Input, Spinner } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import { FieldMetadata, getInputProps } from "@conform-to/react";

export const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
    a?.id === b?.id;

type InputTypes = "number" | "color" | "search" | "time" | "text" | "hidden" | "email" | "tel" | "checkbox" | "date" | "datetime-local" | "file" | "month" | "password" | "radio" | "range" | "url" | "week";

export const initialValue = { id: 0, value: ''};

interface Props {
    keyFetcher: string,
    actionRoute: string,
    label: string,
    comboBoxName: string,
    placeholder: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: FieldMetadata<unknown, any, any>,
    value?: string,
    onValueChange?: (value: string) => void,
    inputType?: InputTypes,
    defaultValue?: string,
    selectedItem?: Autocomplete, 
    startContent?: React.ReactNode
    onSelected?: (value: Autocomplete) =>  void,
    onChange?: (value: string)  => void
}

export const AutocompleteValidation = ({ 
    keyFetcher, 
    actionRoute, 
    label,
    inputType,
    metadata, 
    comboBoxName, 
    placeholder, 
    selectedItem,
    onSelected, 
    onChange,
    ...restProps
}: Props) => {

    const [query, setQuery] = useState('');
    const [displayValue, setDisplayValue] = useState('');
    const [selected, setSelected] = useState<Autocomplete | undefined>({...initialValue});
    const { submit, data, state } = useFetcher<HandlerSuccess<Autocomplete[]>>({ key: keyFetcher });
    const type = inputType ?? 'text';
    const { key, ...restInputProps} = getInputProps(metadata, { type, ariaAttributes: true });

    const isControlled = !!selectedItem && !!onSelected;

    // TODO: mover esto al handlechange a ver que sucede p
    useEffect(() => {
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

  console.log({query, displayValue, selected});

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
                        isInvalid={!!metadata.errors}
                        color={metadata.errors ? "danger" : "default"}
                        errorMessage={metadata.errors}
                        value={displayValue}
                        key={key}
                        {...restInputProps}
                        {...restProps}
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