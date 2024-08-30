import { useEffect } from "react";

import { useFetcher} from "@remix-run/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { nameSchema } from "~/schemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { action } from "~/routes/_app+/municipality/_index";
import { InputValidation } from "../forms/Input";


export function MunicipalityButtonAdd() {
    const fetcher = useFetcher<typeof action>();
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const wasCreated = fetcher.data?.status === 'success' && isOpen && fetcher.state === 'idle';
    const  isCreating = fetcher.state !== 'idle';
    
    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: nameSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',

    }); 

    useEffect(() => {
        if(wasCreated) {
          onClose();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [wasCreated]);
    
      useEffect(() => {
        if(!isOpen && form?.status === 'error') {
            form.reset()        
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen]);
    
      const handleOpen = () => {
        onOpen();
    }

    return (
        <>
            <Button 
                variant="ghost" 
                color="secondary" 
                endContent={<FaPlus />}
                onPress={handleOpen}
            >
                Agregar Municipio
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
                        <fetcher.Form 
                            method='POST' 
                            action="/municipality"
                            onSubmit={form.onSubmit}
                            id={form.id}
                        >
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Municipio
                            </ModalHeader>
                            <ModalBody> 
                                <InputValidation
                                    label="Nombre"
                                    placeholder="Ingresa el Municipio"
                                    name={fields.name.name}
                                    key={fields.name.key}
                                    errors={fields.name.errors}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button 
                                    color="danger" 
                                    variant="flat" 
                                    onPress={onClose}
                                    isDisabled={isCreating}
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
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    )   
}