import { getFormProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { exportLayoutSchema } from "~/schemas/creditSchema";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { Autocomplete } from "~/.server/interfaces";

interface Props {
    isOpen: boolean,
    onOpenChange: () => void
}

export const ModalExportLayout = ({ isOpen, onOpenChange }: Props) => {

    const fetcher = useFetcher();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: exportLayoutSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 
    
    const folder = useInputControl(fields.folder);


    const handleSelected = ({ id }: Autocomplete) => {
        fetcher.load(`/folder/group?id=${id}`);
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
        <fetcher.Form
            method='POST'
            action={`/credit/export`}
            { ...getFormProps(form) }
        >
          <ModalHeader className="flex flex-col gap-1">
            Exportar a excel la plantilla
          </ModalHeader>
          <ModalBody>
          <AutocompleteValidation 
                keyFetcher='findFolderAutocomplete' 
                actionRoute='/folder/search' 
                label='Carpeta' 
                comboBoxName='folder' 
                placeholder='Ingresa la carpeta' 
                onSelected={handleSelected}
                metadata={fields.folder}      
                onValueChange={folder.change}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cerrar
            </Button>
            <Button 
                color="success" 
                variant='bordered' 
                onPress={onClose}
            >
              Exportar
            </Button>
          </ModalFooter>
        </fetcher.Form>
      )}
    </ModalContent>
  </Modal>
  )
}