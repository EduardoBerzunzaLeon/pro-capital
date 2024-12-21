import { useFetcher} from "@remix-run/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { action } from "~/routes/_app+/municipality/_index";
import { useModalCreateForm } from "~/application";
import { actionSchema } from "~/schemas/genericSchema";
import { HandlerSuccess } from "~/.server/reponses";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";


export function RouteButtonAdd() {
    const fetcher = useFetcher<typeof action>();
    const fetcherNextConsecutive = useFetcher<HandlerSuccess<{ consecutive: number}>>({
        key: 'getNextConsecutiveRoute' 
    });
        
    const [form] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: actionSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 

    const { isOpen, onOpenChange, onOpen, isCreating } = useModalCreateForm({ 
        form, 
        state: fetcher.state, 
        status: fetcher.data?.status 
    });

    const handleOpen = () => {
        fetcherNextConsecutive.load('/routePage/consecutive');
        onOpen();
    }

    const isVisible =  fetcherNextConsecutive.state == 'idle' && fetcherNextConsecutive.data?.serverData?.consecutive;


    return (
        <>
            <Button 
                variant="ghost" 
                color="secondary" 
                endContent={<FaPlus />}
                onPress={handleOpen}
            >
                Agregar Ruta
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
                     <ModalBodyHandler 
                        state={fetcherNextConsecutive.state} 
                        loadingMessage='Buscando la nueva ruta'
                        error={fetcherNextConsecutive.data?.error}             
                      />

                      {
                        (isVisible) && (
                        <fetcher.Form 
                            method='POST' 
                            action="/routePage"
                            { ...getFormProps(form)}
                        >
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Ruta
                            </ModalHeader>
                            <ModalBody> 
                                <Input
                                     variant='bordered'
                                     labelPlacement='outside'
                                     name='route'
                                     label='Ruta'
                                     isDisabled
                                     isRequired
                                     description='El sistema calcula automáticamente el nombre de la ruta.'
                                     value={`Ruta ${String(fetcherNextConsecutive.data?.serverData.consecutive)}`}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button 
                                    color="danger" 
                                    variant="flat" 
                                    onPress={onClose}
                                    isDisabled={isCreating}
                                >
                                    Cerrar
                                </Button>
                                <Button 
                                    color="primary" 
                                    type='submit' 
                                    name='_action' 
                                    value='create'
                                    isDisabled={isCreating}
                                    isLoading={isCreating}
                                >
                                    Crear
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