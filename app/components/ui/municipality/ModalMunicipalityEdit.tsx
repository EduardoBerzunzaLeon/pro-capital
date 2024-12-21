import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { action, loader } from "~/routes/_app+/municipality/$municipalityId/_index";
import { nameSchema } from "~/schemas";
import { InputValidation } from "../forms/Input";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}

export function ModalMunicipalityEdit({
        isOpen, 
        onOpenChange
    }: Props) {
    
    const fetcher = useFetcher<typeof action>();
    const fetcherGet = useFetcher<typeof loader>({ key: 'getMunicipality' });
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isUpdating =  fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

        
    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: nameSchema });
        },
        lastResult: fetcherGet.data?.serverData,
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 

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
                <fetcher.Form 
                  method='POST' 
                  action={`/municipality/${fetcherGet.data?.serverData?.id}`}
                  { ...getFormProps(form)}
                >
                    <ModalHeader className="flex flex-col gap-1">
                        Actualizar Municipio de {fetcherGet.data?.serverData.name}
                    </ModalHeader>
                    <ModalBody>
                        <InputValidation
                             label="Nombre"
                             placeholder="Ingresa el Municipio"
                             defaultValue={fetcherGet.data?.serverData?.name}
                             metadata={fields.name}
                             isRequired
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