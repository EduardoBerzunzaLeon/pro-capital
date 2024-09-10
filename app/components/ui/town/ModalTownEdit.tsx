import {  useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { Autocomplete} from "~/.server/interfaces";
import { AutocompleteCombobox } from "../forms/Autocomplete";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { nameSchema } from "~/schemas";
import { action, loader } from "~/routes/_app+/town/$townId/_index";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { InputValidation } from "../forms/Input";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}


export function ModalTownEdit({
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher<typeof action>();
    const fetcherGet = useFetcher<typeof loader>({ key: 'getTown' });
    const [selected, setSelected] = useState<Autocomplete | undefined>({id: -1, value: ''});
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isUpdating = fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

      const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: nameSchema });
        },
        lastResult: fetcherGet.data?.serverData,
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
      }); 
      
      useEffect(() => {
        if(fetcherGet?.data?.serverData?.municipality?.id) {
          setSelected({
            id: fetcherGet?.data?.serverData?.municipality?.id,
            value:  fetcherGet?.data?.serverData?.municipality?.name ?? ''
          });
        }
      }, [fetcherGet.data])

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
            <ModalBodyHandler 
              state={fetcherGet.state} 
              loadingMessage='Buscando el municipio'
              error={fetcherGet.data?.error}             
            />
              {
                 (isVisible) &&
                   (
                    <>
                    <fetcher.Form 
                      method='POST' 
                      action={`/town/${fetcherGet.data?.serverData.id}`}
                      { ...getFormProps(form)}
                    >
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar Localidad de {fetcherGet.data?.serverData.name}
                        </ModalHeader>
                        <ModalBody>

                          <AutocompleteCombobox 
                            keyFetcher='findMunicipalityAutocomplete' 
                            actionRoute='/municipality/search' 
                            label='Municipio' 
                            comboBoxName='municipality' 
                            placeholder='Ingresa el municipio'
                            onSelected={setSelected}           
                            selectedItem={selected}       
                          />
                          <InputValidation
                             label="Localidad"
                             placeholder="Ingresa la localidad"
                             defaultValue={fetcherGet.data?.serverData?.name}
                             metadata={fields.name}
                          />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button 
                              color="primary" 
                              type='submit' 
                              name='_action' 
                              value='update' 
                              isLoading={isUpdating}
                              isDisabled={isUpdating}
                            >
                                Actualizar
                            </Button>
                        </ModalFooter>
                    </fetcher.Form>
                    </>
                  )
              }
              
            </>
          )}
        </ModalContent>
      </Modal>)

}