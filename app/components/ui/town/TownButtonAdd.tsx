// import { useEffect } from "react";

import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { FaChevronDown, FaPlus  } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { HandlerSuccess, ActionPostMunicipality } from "~/.server/reponses";
// import { nameSchema } from "~/schemas";
// import { useForm } from "@conform-to/react";
// import { parseWithZod } from "@conform-to/zod";

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
// import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { FaCheck } from "react-icons/fa6";
import clsx from 'clsx'
import { forwardRef, useEffect, useState } from 'react'
import { Autocomplete } from "~/.server/interfaces";
import {MyInput} from "./Test";
// import { Autocomplete } from "~/.server/interfaces";
// import { HandlerSuccess } from "~/.server/reponses";
// Ref<HTMLInputElement> | undefined
const MyCustomInput = forwardRef(function MyInputs(props, ref: React.ForwardedRef<HTMLInputElement | null>) {
  console.log(ref);
  return <input 
    // {...props} 
    onChange={props.onChange}
    ref={ref} 
    placeholder="Ingresa el municipio"  
    className={clsx(
              'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
    // baseRef={ref}
    // value={props.value}
  />
})



const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
  a?.id === b?.id;

export function TownButtonAdd() {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const { submit, data, state } = useFetcher({ key: 'findMunicipalityAutocomplete' });
    const [query, setQuery] = useState('');

    // const [form, fields] = useForm({
    //     onValidate({ formData }) {
    //       return parseWithZod(formData, { schema: nameSchema });
    //     },
    //     shouldValidate: 'onSubmit',
    //     shouldRevalidate: 'onInput',
    // }); 

    useEffect(() => {

      // load(`/municipality/search/?data=${query}`)
        submit({ data: query }, { action: '/municipality/search' });

    }, [query, submit])

    console.log({query, data, state})

    const [selected, setSelected] = useState({id: 0, value: ''});

    const handleOpen = () => {
        onOpen();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
        // submit({ data: event.target.value}, { action: '/municipality/search' });
    }

    // const handleClick = () => {
    //   submit({ data: query }, { action: '/municipality/search' });
    // }

    // useEffect(() => {
    //     if(fetcher.data?.error && isOpen && fetcher.state === 'idle') {
    //       toast.error(fetcher.data?.error, {
    //         toastId: 'addMunicipality'
    //       });
    //     }
        
    //     if(fetcher.data?.status === 'success' && isOpen && fetcher.state === 'idle') {
    //       toast.success('El municipio se creo correctamente');
    //       onClose();
    //     }
    
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [fetcher, fetcher.data, fetcher.state]);

 
    return (
        <>
            <Button 
                variant="ghost" 
                color="secondary" 
                endContent={<FaPlus />}
                onPress={handleOpen}
            >
                Agregar Localidad
            </Button>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
                className='red-dark text-foreground bg-content1'
                isDismissable={false}
            >
                <ModalContent>
                {(onClose) => (
                    <>
         
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Localidad
                            </ModalHeader>
                            <ModalBody> 
                            {/* <div className="mx-auto h-screen w-52 pt-20"> */}
      <Combobox 
        value={selected} 
        onChange={(value) => {
          console.log(value);
          setSelected(value)
        }} 
        by={compareAutocomplete}
        onClose={() => {
          console.log('data');
          setQuery('')
        }}
      >
        <div className="relative">
          <ComboboxInput
            // className={clsx(
            //   'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
            //   'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            // )}
            displayValue={(municipality) => {
              return municipality?.value;
            }}
            onChange={handleChange}
            // as={MyCustomInput}
            as={MyInput}

          />
           
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            { state !== 'idle' && <Spinner size='sm' />}
            {/* <FaChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" /> */}
          </ComboboxButton>
        </div>
                {(state === 'idle') ?(
                          <ComboboxOptions
                          anchor="bottom"
                          transition
                          className={clsx(
                            'w-[var(--input-width)] rounded-xl border z-50  border-white/5 bg-current p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                          )}
                          >
                          {data?.data?.map((municipality) => (
                            <ComboboxOption
                              key={municipality.id}
                              value={municipality}
                              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                            >
                              <FaCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                              <div className="text-sm/6 text-white">{municipality.value}</div>
                            </ComboboxOption>
                          ))}
                          </ComboboxOptions>
                ): null}
       
      </Combobox>
    {/* </div> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" type='submit' name='_action' value='create'>
                                    Crear
                                </Button>
                            </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    )   
}