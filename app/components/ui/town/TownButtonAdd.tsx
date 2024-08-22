
import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { FaPlus  } from "react-icons/fa";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
import { FaCheck } from "react-icons/fa6";
import clsx from 'clsx'
import { forwardRef, useEffect, useState } from 'react'
import { Autocomplete } from "~/.server/interfaces";
import { toast } from "react-toastify";
import { HandlerSuccess } from "~/.server/reponses";
import { RequestDataGeneric } from '../../../.server/interfaces/generic.interface';

const MyCustomInput = forwardRef(function MyInputs(props, ref: React.ForwardedRef<HTMLInputElement | null>) {
    return <input 
    {...props} 
    ref={ref} 
    placeholder="Ingresa el municipio"  
    className={clsx(
              'w-full mt-1  rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
  />
})



const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
  a?.id === b?.id;

const initialValue = {id: 0, value: ''};

export function TownButtonAdd() {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const { submit, data, state } = useFetcher<HandlerSuccess<Autocomplete[]>>({ key: 'findMunicipalityAutocomplete' });
    const fetcher = useFetcher<HandlerSuccess<RequestDataGeneric>>({ key: 'createTown' });
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Autocomplete | undefined>({...initialValue});

    useEffect(() => {
        submit({ data: query }, { action: '/municipality/search' });
    }, [query, submit])

    const handleOpen = () => {
        onOpen();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
    }

    useEffect(() => {
        if(fetcher.data?.error && isOpen && fetcher.state === 'idle') {
          toast.error(fetcher.data?.error, {
            toastId: 'addMunicipality'
          });
        }
        
        if(fetcher.data?.status === 'success' && isOpen && fetcher.state === 'idle') {
          toast.success('La localidad se creo correctamente');
          onClose();
        }
    
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [fetcher, fetcher.data, fetcher.state]);

 
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
                    <fetcher.Form
                      method='POST'
                      action='/town'
                    >
         
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Localidad
                            </ModalHeader>
                            <ModalBody> 
      <Field>
                            <Label className='m-2'>Municipio</Label>
      <Combobox
        name='municipality' 
        value={selected} 
        onChange={(value) => {
          setSelected(value ?? undefined);
        }} 
        by={compareAutocomplete}
        onClose={() => {
          console.log('data');
          setQuery('')
        }}
      >
        <div className="relative">
        
          <ComboboxInput
            displayValue={(municipality) => {
              return (municipality as Autocomplete)?.value;
            }}
            onChange={handleChange}
            as={MyCustomInput}
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
                          {data?.serverData?.map((municipality) => (
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
      </Field>

                { (selected && selected.id > 0) && (<Input
                  label="Localidad"
                  name='name'
                  // name={fields.userName.name}
                  // key={fields.userName.key}
                  variant="bordered"
                  placeholder="Ingresa el nombre de la localidad"
                  labelPlacement="outside"
                  autoComplete="off"
                />)}
                
    {/* </div> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button 
                                  color="primary" 
                                  type='submit' 
                                  name='_action' 
                                  value='create'
                                  isDisabled={selected?.value.length === 0}
                                  isLoading={fetcher.state !== 'idle'}
                                >
                                    Crear
                                </Button>
                            </ModalFooter>
                    </fetcher.Form>
                )}
                </ModalContent>
            </Modal>
        </>
    )   
}