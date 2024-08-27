import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { MunicipalityI } from "~/.server/domain/entity";
import { HandlerSuccess, ActionPostMunicipality } from "~/.server/reponses";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onOpenChange: (isOpen: boolean) => void
}

export function ModalMunicipalityEdit({
        isOpen, 
        onClose,
        onOpenChange
    }: Props) {
    
    const fetcher = useFetcher<HandlerSuccess<ActionPostMunicipality>>();
    const fetcherGet = useFetcher<HandlerSuccess<MunicipalityI>>({ key: 'getMunicipality' });

    useEffect(() => {
      if(fetcherGet.data?.status === 'error') {
        onClose()
      }
    },[fetcherGet.data])

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
                 (fetcherGet.state === 'idle' && fetcherGet.data?.status !== 'error') ||  fetcher.state === 'loading' ?
                   (
                    <>
                    <fetcher.Form method='POST' action={`/municipality/${fetcherGet.data?.serverData.id}`}>
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
                                placeholder="Ingresa el Municipio"
                                variant="bordered"
                                name='name'
                                defaultValue={fetcherGet.data?.serverData.name}
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