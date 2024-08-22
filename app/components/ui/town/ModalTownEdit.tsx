import { Field, Label, Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { forwardRef, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { TownI } from "~/.server/domain/entity";
import { Autocomplete, Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import clsx from 'clsx'

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}

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


// const initialValue = {id: 0, value: ''};

const compareAutocomplete = (a?: Autocomplete, b?: Autocomplete): boolean =>
  a?.id === b?.id;


export function ModalTownEdit({
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher<HandlerSuccess<Generic>>();
    const fetcherGet = useFetcher<HandlerSuccess<TownI>>({ key: 'getTown' });
    const { submit, data, state } = useFetcher<HandlerSuccess<Autocomplete[]>>({ key: 'findMunicipalityAutocomplete' });
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Autocomplete | undefined>({id: -1, value: ''});
      console.log({fetcherGet: fetcherGet.data});
      console.log({fetcherUpdate: fetcher});

      useEffect(() => {
        if(fetcherGet?.data?.serverData?.municipality?.id) {
          setSelected({
            id: fetcherGet?.data?.serverData?.municipality?.id,
            value:  fetcherGet?.data?.serverData?.municipality?.name ?? ''
          });
        }
      }, [fetcherGet.data])

      useEffect(() => {
        submit({ data: query }, { action: '/municipality/search' });
    }, [query, submit])


    useEffect(() => {
        if(fetcher.data?.error && fetcher.state === 'idle') {
          toast.error(fetcher.data?.error);
        }
        
        if(fetcher.data?.status === 'success' && fetcher.state === 'idle') {
          toast.success('El municipio se actualizo correctamente');
        }

      }, [fetcher.data, fetcher.state])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
    }

    return (
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
              {
                 fetcherGet.state === 'idle' ||  fetcher.state === 'loading' ?
                   (
                    <>
                    <fetcher.Form method='POST' action={`/town/${fetcherGet.data?.serverData.id}`}>
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar Localidad de {fetcherGet.data?.serverData.name}
                        </ModalHeader>
                        <ModalBody>
                            <input 
                                name='id'
                                defaultValue={fetcherGet.data?.serverData.id}
                                type="hidden"
                            />
                   
                             <Field>
                            <Label className='m-2'>Municipio</Label>
      <Combobox
        name='municipality' 
        value={selected} 
        onChange={(value) => {
          setSelected(value ?? {id: -1, value: ''});
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
      <Input
                                label="Nombre"
                                placeholder="Ingresa la localidad"
                                variant="bordered"
                                name='name'
                                defaultValue={fetcherGet.data?.serverData.name}
                                endContent={
                                    fetcher.state !== 'idle' && (
                                        <Spinner color="default"/>
                                    )
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button color="primary" type='submit' name='_action' value='update' isLoading={fetcher.state !== 'idle' || state !== 'idle'}>
                                Actualizar
                            </Button>
                        </ModalFooter>
                    </fetcher.Form>
                    </>
                  )
                  : (<ModalBody>
                    <Spinner 
                      label="Cargando datos del Municipio"
                    />
                  </ModalBody>)
              }
              
            </>
          )}
        </ModalContent>
      </Modal>)

}