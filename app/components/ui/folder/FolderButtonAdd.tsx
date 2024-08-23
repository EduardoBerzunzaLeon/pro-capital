
import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, useDisclosure } from "@nextui-org/react";
import { FaPlus  } from "react-icons/fa";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
import { FaCheck } from "react-icons/fa6";
import clsx from 'clsx'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Autocomplete } from "~/.server/interfaces";
import { toast } from "react-toastify";
import { HandlerSuccess } from "~/.server/reponses";
import { RequestDataGeneric } from '../../../.server/interfaces/generic.interface';

const MyCustomInput = forwardRef(function MyInputs(props, ref: React.ForwardedRef<HTMLInputElement | null>) {
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

export const routes = [
  {key: "1", label: "Ruta 1"},
  {key: "2", label: "Ruta 2"},
];

const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
  a?.id === b?.id;

const initialValue = {id: 0, value: ''};

export function FolderButtonAdd() {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const fetcherNextConsecutive = useFetcher<HandlerSuccess<{
      consecutive: number,
      townId: number
    }>>({ key: 'getNextConsecutiveFolder' });
    const { submit, data, state } = useFetcher<HandlerSuccess<Autocomplete[]>>({ key: 'findTownAutocomplete' });
    const fetcher = useFetcher<HandlerSuccess<RequestDataGeneric>>({ key: 'createFolder' });
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Autocomplete | undefined>({...initialValue});

    const isLoading = fetcherNextConsecutive.state !== 'idle' || fetcherNextConsecutive.data?.serverData?.townId !==  selected?.id;

    useEffect(() => {
        submit({ data: query }, { action: '/town/search' });
    }, [query, submit])

    const folderName = useMemo(() => {
      if(!selected || selected?.id === 0) return 'No se ha asignado la localidad';

      if(isLoading) return 'Creando nombre de la carpeta...';

      if(!fetcherNextConsecutive.data || fetcherNextConsecutive.data.error) return 'No se ha podido crear la carpeta';

      return selected?.value + ' ' + fetcherNextConsecutive?.data?.serverData.consecutive;

    },[selected, fetcherNextConsecutive.data, isLoading])
    
    useEffect(() => {
      if(selected && selected.id > 0) {
        fetcherNextConsecutive.submit({id: selected.id}, {action: '/folder/consecutive'});
      }
    }, [selected]);

    console.log({selected, fetcherNext: fetcherNextConsecutive.state, submission: fetcherNextConsecutive.formData?.get('id') })

    const handleOpen = () => {
        onOpen();
        setSelected({id: 0, value: ''});
    }
    
    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
    }

    useEffect(() => {
        if(fetcher.data?.error && isOpen && fetcher.state === 'idle') {
          toast.error(fetcher.data?.error, {
            toastId: 'addFolder'
          });
        }
        
        if(fetcher.data?.status === 'success' && isOpen && fetcher.state === 'idle') {
          toast.success('La carpeta se creo correctamente');
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
                onClick={handleOpen}
            >
                Agregar Carpeta
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
                      action='/folder'
                    >
         
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Localidad
                            </ModalHeader>
                            <ModalBody> 
              <Select
                items={routes}
                label="Ruta"
                placeholder="Seleccione una ruta"
                className="red-dark text-foreground bg-content1"
                labelPlacement="outside"
                variant="bordered"
                name="route"
              >
                {(route) => <SelectItem key={route.key}>{route.label}</SelectItem>}
              </Select>
      <Field>
                            <Label className='m-2'>Localidad</Label>
      <Combobox
        name='town' 
        value={selected} 
        onChange={(value) => {
          setSelected(value ?? {id: 0, value: ''});
        }} 
        by={compareAutocomplete}
        onClose={() => {
          setQuery('')
        }}
      >
        <div className="relative">
        
          <ComboboxInput
            displayValue={(town) => {
              return (town as Autocomplete)?.value;
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
                          {data?.serverData?.map((town) => (
                            <ComboboxOption
                              key={town.id}
                              value={town}
                              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                            >
                              <FaCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                              <div className="text-sm/6 text-white">{town.value}</div>
                            </ComboboxOption>
                          ))}
                          </ComboboxOptions>
                ): null}
       
      </Combobox>
                </Field>
                { ( selected?.value ) && (<Input
                  label="Carpeta"
                  name='folder'
                  variant="bordered"
                  placeholder="Ingresa el nombre de la localidad"
                  labelPlacement="outside"
                  value={ folderName }
                  autoComplete="off"
                  isDisabled
                  endContent={
                    (isLoading) && <Spinner size='sm'/>
                  }
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