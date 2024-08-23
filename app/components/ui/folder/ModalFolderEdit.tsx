import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}

export function ModalFolderEdit({
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher<HandlerSuccess<Generic>>();
    const fetcherGet = useFetcher<HandlerSuccess<Generic>>({ key: 'getFolder' });

    useEffect(() => {
        
        if(fetcher.data?.error ) {
          toast.error(fetcher.data?.error);
        }
        
        if(fetcher.data?.status === 'success' ) {
          toast.success('El municipio se actualizo correctamente');
        }

      }, [fetcher.data]);

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
                    <fetcher.Form method='POST' action={`/folder/${fetcherGet.data?.serverData.id}`}>
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar Municipio de {fetcherGet.data?.serverData.name}
                        </ModalHeader>
                        <ModalBody>
                            <input 
                                name='id'
                                defaultValue={fetcherGet.data?.serverData.id}
                                type="hidden"
                            />
                            <Input
                                label="Nombre"
                                placeholder="Ingresa el numero de la ruta"
                                variant="bordered"
                                name='route'
                                type='number'
                                defaultValue={fetcherGet.data?.serverData.route.id}
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
                            <Button color="primary" type='submit' name='_action' value='update'>
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