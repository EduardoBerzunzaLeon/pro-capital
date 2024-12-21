
import { useEffect, useMemo, useState } from 'react'

import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { FaPlus  } from "react-icons/fa";
import { Autocomplete } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { RequestDataGeneric } from '../../../.server/interfaces/generic.interface';
import { AutocompleteCombobox } from "../forms/Autocomplete";
import { getFormProps, useForm } from "@conform-to/react";
import { useModalCreateForm } from "~/application";
import { parseWithZod } from '@conform-to/zod';
import { actionSchema } from '~/schemas/genericSchema';
import { SelectRoutes } from '../route/SelectRoutes';

export function FolderButtonAdd() {
    const fetcherNextConsecutive = useFetcher<HandlerSuccess<{
      consecutive: number,
      townId: number
    }>>({ key: 'getNextConsecutiveFolder' });
    const fetcher = useFetcher<HandlerSuccess<RequestDataGeneric>>({ key: 'createFolder' });
    const [selected, setSelected] = useState<Autocomplete | undefined>();

    const isLoading = fetcherNextConsecutive.state !== 'idle' 
      || fetcherNextConsecutive.data?.serverData?.townId !==  selected?.id;

    const folderName = useMemo(() => {
      if(!selected || selected?.id === 0) return 'No se ha asignado la localidad';

      if(isLoading) return 'Creando nombre de la carpeta...';

      if(!fetcherNextConsecutive.data || fetcherNextConsecutive.data.error) return 'No se ha podido crear la carpeta';

      return selected?.value + ' ' + fetcherNextConsecutive?.data?.serverData.consecutive;

    },[selected, fetcherNextConsecutive.data, isLoading])

    const [form] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: actionSchema });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onInput',
    }); 

    const { isOpen, onOpenChange, onOpen, isCreating } = useModalCreateForm({ 
      form, 
      state: fetcher.state, 
      status: fetcher.data?.status 
  });

    useEffect(() => {
        if(selected && selected.id > 0) {
          fetcherNextConsecutive.submit({id: selected.id}, {action: '/folder/consecutive'});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);


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
                  { ...getFormProps(form) }
                >
         
            <ModalHeader className="flex flex-col gap-1">
            Agregar Carpeta
            </ModalHeader>
              <ModalBody> 
              <SelectRoutes isRequired />
                
              <AutocompleteCombobox 
                    keyFetcher='findTownAutocomplete' 
                    actionRoute='/town/search' 
                    label='Localidad' 
                    comboBoxName='town' 
                    placeholder='Ingresa la localidad'
                    onSelected={setSelected}                  
                    isRequired
                />

                { ( selected?.value ) && (<Input
                  label="Carpeta"
                  name='folder'
                  variant="bordered"
                  placeholder="Ingresa el nombre de la localidad"
                  description='El sistema calcula automáticamente el nombre de la carpeta'
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