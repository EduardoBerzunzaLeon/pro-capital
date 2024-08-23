import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner, Select, SelectItem } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";

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

    useEffect(() => {
        
        if(fetcher.data?.error ) {
          toast.error(fetcher.data?.error);
        }
        
        if(fetcher.data?.status === 'success' ) {
          toast.success('La carpeta se actualizo correctamente');
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
                          <Select
                            items={routes}
                            label="Ruta"
                            placeholder="Seleccione una ruta"
                            className="red-dark text-foreground bg-content1"
                            labelPlacement="outside"
                            variant="bordered"
                            name="route"
                            defaultSelectedKeys={[fetcherGet.data?.serverData.route.id+'']}
                          >
                            {(route) => <SelectItem key={route.key}>{route.label}</SelectItem>}
                          </Select>
                            {/* <Input
                                label="Ruta"
                                placeholder="Ingresa el numero de la ruta"
                                variant="bordered"
                                name='route'
                                type='number'
                                defaultValue={fetcherGet.data?.serverData.route.id}
                            /> */}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button color="primary" type='submit' name='_action' value='update' isLoading={fetcher.state !== 'idle'}>
                                Actualizar
                            </Button>
                        </ModalFooter>
                    </fetcher.Form>
                    </>
                  )
                  : (<ModalBody>
                    <Spinner 
                      label="Cargando datos de la carpeta"
                    />
                  </ModalBody>)
              }
              
            </>
          )}
        </ModalContent>
      </Modal>)

}