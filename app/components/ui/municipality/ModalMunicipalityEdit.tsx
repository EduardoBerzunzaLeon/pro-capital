import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
    id: number;
    name: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
    fetcherState: string;
}

export function ModalMunicipalityEdit({ 
        id, 
        name, 
        fetcherState, 
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher();

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
                 fetcherState === 'idle' ||  fetcher.state === 'loading' ?
                   (
                    <>
                    <fetcher.Form method='POST' action="/municipality">
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar Municipio de {name}
                        </ModalHeader>
                        <ModalBody>
                            <input 
                                name='id'
                                defaultValue={id}
                                type="hidden"
                            />
                            <Input
                                label="Nombre"
                                placeholder="Ingresa el Municipio"
                                variant="bordered"
                                name='name'
                                defaultValue={name}
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
                  : <p>Cargando los datos</p>
                       
              }
              
            </>
          )}
        </ModalContent>
      </Modal>)

}