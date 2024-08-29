import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { MunicipalityI } from "~/.server/domain/entity";
import { HandlerSuccess, ActionPostMunicipality } from "~/.server/reponses";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}

export function ModalMunicipalityEdit({
        isOpen, 
        onOpenChange
    }: Props) {
    
    const fetcher = useFetcher<HandlerSuccess<ActionPostMunicipality>>();
    const fetcherGet = useFetcher<HandlerSuccess<MunicipalityI>>({ key: 'getMunicipality' });
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isUpdating =  fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

    return (
      <>
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
             <ModalBodyHandler 
              state={fetcherGet.state} 
              loadingMessage='Buscando el municipio'
              error={fetcherGet.data?.error}             
            />
             {
              (isVisible) && (
                <fetcher.Form method='POST' action={`/municipality/${fetcherGet.data?.serverData?.id}`}>
                    <ModalHeader className="flex flex-col gap-1">
                        Actualizar Municipio de {fetcherGet.data?.serverData.name}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre"
                            placeholder="Ingresa el Municipio"
                            variant="bordered"
                            name='name'
                            defaultValue={fetcherGet.data?.serverData?.name}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                          color="danger" 
                          variant="flat" 
                          onPress={onClose} 
                          isDisabled={isUpdating}
                        >
                            Cerrar
                        </Button>
                        <Button  
                          color="primary" 
                          type='submit' 
                          name='_action' 
                          value='update'
                          isLoading={isUpdating}
                          isDisabled={isUpdating}
                        >
                            Actualizar
                        </Button>
                    </ModalFooter>
                </fetcher.Form>
              ) 
             }
             
           </>
         )}
        </ModalContent>

      </Modal>
      </>
      )

}