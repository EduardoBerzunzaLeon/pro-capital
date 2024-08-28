import { useEffect } from "react";

import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { HandlerSuccess, ActionPostMunicipality } from "~/.server/reponses";
import { nameSchema } from "~/schemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";


export function MunicipalityButtonAdd() {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const fetcher = useFetcher<HandlerSuccess<ActionPostMunicipality>>();

    console.log({data:fetcher.data, state:fetcher.state, fetcher});

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: nameSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 

    const handleOpen = () => {
        onOpen();
    }

    useEffect(() => {
        
        if(fetcher.data?.status === 'success' && isOpen && fetcher.state === 'idle') {
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
                                <Input
                                    label="Nombre"
                                    placeholder="Ingresa el Municipio"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    name={fields.name.name}
                                    key={fields.name.key}
                                    isInvalid={!!fields.name.errors}
                                    color={fields.name.errors ? "danger" : "default"}
                                    errorMessage={fields.name.errors}
                                    endContent={fetcher.state !== 'idle' && (
                                        <Spinner />
                                    )}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" type='submit' name='_action' value='create'>
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