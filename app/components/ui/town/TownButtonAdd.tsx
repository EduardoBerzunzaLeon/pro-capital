
import { useState } from 'react'

import { useFetcher} from "@remix-run/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FaPlus  } from "react-icons/fa";
import { Autocomplete } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { RequestDataGeneric } from '../../../.server/interfaces/generic.interface';
import { AutocompleteCombobox } from "../forms/Autocomplete";
import { getFormProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { nameSchema } from '~/schemas';
import { useModalCreateForm } from '~/application';
import { InputValidation } from '../forms/Input';


export function TownButtonAdd() {
    const fetcher = useFetcher<HandlerSuccess<RequestDataGeneric>>({ key: 'createTown' });

    const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: nameSchema });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onInput',
    }); 


    const { isOpen, onOpenChange, onOpen, isCreating } = useModalCreateForm({ 
        form, 
        state: fetcher.state, 
        status: fetcher.data?.status 
    });

    const [selected, setSelected] = useState<Autocomplete | undefined>();

    const handleOpen = () => {
        onOpen();
        setSelected({ id: 0, value: '' });
    }

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
                    { ...getFormProps(form)}
                  >
                  <ModalHeader className="flex flex-col gap-1">
                    Agregar Localidad
                  </ModalHeader>
                  <ModalBody> 
                  <AutocompleteCombobox 
                    keyFetcher='findMunicipalityAutocomplete' 
                    actionRoute='/municipality/search' 
                    label='Municipio' 
                    comboBoxName='municipality' 
                    placeholder='Ingresa el municipio'
                    onSelected={setSelected}          
                    isRequired        
                  />

                { (selected && selected.id > 0) && 
                  (<InputValidation
                    label="Localidad"
                    placeholder="Ingresa la localidad"
                    isRequired
                    metadata={fields.name}
                  />)}
                </ModalBody>
                  <ModalFooter>
                      <Button 
                        color="danger" 
                        variant="flat" 
                        onPress={onClose}
                      >
                          Cerrar
                      </Button>
                      <Button 
                          color="primary" 
                          type='submit' 
                          name='_action' 
                          value='create'
                          isDisabled={isCreating}
                          isLoading={isCreating}
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