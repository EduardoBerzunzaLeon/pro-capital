import { useEffect } from "react";

import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { HandlerSuccess, ActionPostMunicipality } from "~/.server/reponses";


export function MunicipalityButtonAdd() {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const fetcher = useFetcher<HandlerSuccess<ActionPostMunicipality>>({ key: 'municipalityCreate' });

    const handleOpen = () => {
        onOpen();
    }

    useEffect(() => {
        if(fetcher.data?.error && isOpen && fetcher.state === 'idle') {
          toast.error(fetcher.data?.error, {
            toastId: 'addMunicipality'
          });
        }
        
        if(fetcher.data?.status === 'success' && isOpen && fetcher.state === 'idle') {
          toast.success('El municipio se creo correctamente');
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
                        <fetcher.Form method='POST' action="/municipality">
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Municipio
                            </ModalHeader>
                            <ModalBody> 
                                <Input
                                    label="Nombre"
                                    placeholder="Ingresa el Municipio"
                                    variant="bordered"
                                    name='name'
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