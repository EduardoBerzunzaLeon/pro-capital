import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { AutocompleteCombobox } from "../forms/Autocomplete";
import { useForm, getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { actionSchema } from "~/schemas/genericSchema";
import { useEffect } from "react";

interface Props {
  fullname: string,
  id: number,
  isVisible?: boolean,
  folderName: string,
  handleSelectedId: (id: number) => void
}

export function ModalSubscribeLeader({ fullname, id, handleSelectedId, isVisible, folderName }: Props)  {
  const fetcher = useFetcher<HandlerSuccess<Generic>>();
  
  const [form] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: actionSchema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  }); 

  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const wasUpdated = fetcher.state === 'idle' && fetcher.data?.status === 'success' 
    && isOpen;
  const isUpdating = fetcher.state !== 'idle';


  const handleClose = () => {
      onClose()
      handleSelectedId(0);
  }

  const handleOpenChange = () => {
      onOpenChange();
      handleSelectedId(0);
  }

  useEffect(() => {
      if(wasUpdated) {
        console.log('closed')
          onClose();
          handleSelectedId(0);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasUpdated]);


  useEffect(() => {
      if(id > 0 && isVisible) {
          onOpen()
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id,  isVisible])

  return (
    <Modal 
    isOpen={isOpen} 
    onOpenChange={handleOpenChange}
    placement="top-center"
    className='red-dark text-foreground bg-content1'
    isDismissable={false}
  >
    <ModalContent>
      {() => (
        <>
                <fetcher.Form 
                  method='POST' 
                  action={`/leaders/${id}`}
                  { ...getFormProps(form)}
                >
                    <ModalHeader className="flex flex-col gap-1">
                        Reactivar a la líder {fullname.toUpperCase()}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                          isDisabled
                          label='Ultima carpeta asignada'
                          variant='bordered'
                          labelPlacement="outside"
                          defaultValue={folderName}
                        />
                        <AutocompleteCombobox 
                          keyFetcher='findFolderAutocomplete' 
                          actionRoute='/folder/search' 
                          label='Carpeta' 
                          comboBoxName='folder' 
                          placeholder='Ingresa la carpeta'  
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={handleClose}>
                            Cerrar
                        </Button>
                        <Button 
                          color="primary" 
                          type='submit' 
                          name='_action' 
                          value='subscribe' 
                          isDisabled={isUpdating}
                          isLoading={isUpdating}
                        >
                            Actualizar
                        </Button>
                    </ModalFooter>
                </fetcher.Form>
        </>
      )}
    </ModalContent>
  </Modal>
  )
}
