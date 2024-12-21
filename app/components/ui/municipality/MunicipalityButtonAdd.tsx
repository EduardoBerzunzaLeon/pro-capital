import { useFetcher} from "@remix-run/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { nameSchema } from "~/schemas";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { action } from "~/routes/_app+/municipality/_index";
import { InputValidation } from "../forms/Input";
import { useModalCreateForm } from "~/application";


export function MunicipalityButtonAdd() {
    const fetcher = useFetcher<typeof action>();
    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: nameSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',

    }); 

    const { isOpen, onOpenChange, onOpen, isCreating } = useModalCreateForm({ 
        form, 
        state: fetcher.state, 
        status: fetcher.data?.status 
    });


    return (
        <>
            <Button 
                variant="ghost" 
                color="secondary" 
                endContent={<FaPlus />}
                onPress={onOpen}
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
                        <fetcher.Form 
                            method='POST' 
                            action="/municipality"
                            { ...getFormProps(form)}
                        >
                            <ModalHeader className="flex flex-col gap-1">
                            Agregar Municipio
                            </ModalHeader>
                            <ModalBody> 
                                <InputValidation
                                    label="Nombre"
                                    placeholder="Ingresa el Municipio"
                                    metadata={fields.name}
                                    isRequired
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
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    )   
}