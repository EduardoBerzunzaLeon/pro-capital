import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { SelectRoutes } from "../route/SelectRoutes";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}

export const routes = [
  {key: "1", label: "Ruta 1"},
  {key: "2", label: "Ruta 2"},
];

export function ModalFolderEdit({
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher<HandlerSuccess<Generic>>();
    const fetcherGet = useFetcher<HandlerSuccess<Generic>>({ key: 'getFolder' });
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isUpdating = fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

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
              <ModalBodyHandler 
                state={fetcherGet.state} 
                loadingMessage='Buscando el grupo de la carpeta'
                error={fetcherGet.data?.error}             
              />
              {
                 (isVisible) &&
                   (
                    <>
                    <fetcher.Form 
                      method='POST' 
                      action={`/folder/${fetcherGet.data?.serverData.id}`}
                    >
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar la Carpeta {fetcherGet.data?.serverData.name}
                        </ModalHeader>
                        <ModalBody>
                          <SelectRoutes 
                            defaultSelectedKeys={[isUpdating ? fetcher.formData?.get('route')+'' : fetcherGet.data?.serverData.route.id+'']}
                          />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
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
                    </>
                  )
              }
              
            </>
          )}
        </ModalContent>
      </Modal>)

}