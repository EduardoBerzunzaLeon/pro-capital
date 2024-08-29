import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
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
    // const revalidator = useRevalidator();

    // console.log(fetcherGet.state, fetcher.state, revalidator.state)

    console.log(fetcherGet.data)

    // useEffect(() => {
    //   if(!fetcherGet.data && fetcherGet.state === 'idle') {
    //     onClose()
    //   }

    //   // if(Number(fetcherGet.data?.status) === 404 && fetcherGet.state === 'idle' ) {
    //   //   onClose();
    //   //   if(revalidator.state === 'idle') {
    //   //     revalidator.revalidate()
    //   //   }
    //   // }
    // },[fetcherGet.data, fetcherGet.state])
    
    // useEffect(() => {
    //   if(
    //     Number(fetcher.data?.status) === 500 || Number(fetcher.data?.status) === 404
    //   ) {
    //     onClose()
    //   }
    // },[fetcher.data, fetcher.state])

    return (
      <>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        className='red-dark text-foreground bg-content1'
        isDismissable={false}
      >
         {  (Number(fetcherGet.data?.status) === 404) 
              ? <p>Ocurrio un error, favor de refrescar la página</p>
              : (
<ModalContent>
         
         {(onClose) => (
           <>
             {
                (fetcherGet.state === 'idle' && fetcherGet.data && fetcherGet.data.serverData) ||  fetcher.state === 'loading' ?
                  (
                   <>
                   <fetcher.Form method='POST' action={`/municipality/${fetcherGet.data?.serverData?.id}`}>
                       <ModalHeader className="flex flex-col gap-1">
                           Actualizar Municipio de {fetcherGet.data?.serverData.name}
                       </ModalHeader>
                       <ModalBody>
                           <input 
                               name='id'
                               defaultValue={fetcherGet.data?.serverData?.id}
                               type="hidden"
                           />
                           <Input
                               label="Nombre"
                               placeholder="Ingresa el Municipio"
                               variant="bordered"
                               name='name'
                               defaultValue={fetcherGet.data?.serverData?.name}
                               endContent={
                                   ( fetcher.state !== 'idle' || fetcherGet.state !== 'idle' ) && (
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
                
              )
        
          }
      </Modal>
      </>
      )

}