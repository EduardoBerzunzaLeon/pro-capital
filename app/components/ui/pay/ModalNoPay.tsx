import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { loader } from "~/routes/_app+/pay/$creditId";
import { InputValidation } from "../forms/Input";
import { TextareaValidation } from "../forms/Textarea";
import { getLocalTimeZone, today } from "@internationalized/date";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { noPaymentSchema } from '../../../schemas/paymentSchema';

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}


export const ModalNoPay = ({ isOpen, onOpenChange }: Props) => {

    const fetcherGet = useFetcher<typeof loader>({ key:  'getSinglePayment' });
    const fetcher = useFetcher();
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isCreating = fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: noPaymentSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
        defaultValue: {
            folio: 0
        }
      }); 
  
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
              loadingMessage='Buscando el crédito'
              error={fetcherGet.data?.error}             
            />
            {
                (isVisible) && (
                    <fetcher.Form
                        method='POST'
                        action={`/pay/${fetcherGet.data?.serverData?.id}`}
                        { ...getFormProps(form) }
                    >
                        <ModalHeader className="flex flex-col gap-1">Relizar No pago de {fetcherGet.data?.serverData?.client.fullname.toUpperCase()}</ModalHeader>
                        <ModalBody>
                            <span>
                                Carpeta: <span className="capitalize font-bold">{fetcherGet.data?.serverData?.folder.name}</span>
                            </span>
                            <span>
                                Grupo: <span className="capitalize font-bold">{fetcherGet.data?.serverData?.group.name}</span>
                            </span>
                            <span>
                                Deuda Actual: <span className="capitalize font-bold">${fetcherGet.data?.serverData?.currentDebt}</span>
                            </span>
                            <AutocompleteValidation 
                                keyFetcher='findAgentAutocomplete' 
                                actionRoute='/users/agentsSearch' 
                                label='Agente' 
                                comboBoxName='agent' 
                                placeholder='Ingresa el agente' 
                                metadata={fields.agent}      
                            />
                            <DatePicker 
                                label="Fecha de asignación del pago" 
                                variant='bordered' 
                                id='paymentDate'
                                key={fields.paymentDate.key}
                                name={fields.paymentDate.name}
                                isInvalid={!!fields.paymentDate.errors}
                                errorMessage={fields.paymentDate.errors}
                                defaultValue={today(getLocalTimeZone())}
                                granularity="day"
                            />
                            <InputValidation
                                label="Folio"
                                placeholder="Ingresa el folio"
                                metadata={fields.folio}
                                inputType='number'
                            />
                            <TextareaValidation 
                                label='Notas' 
                                placeholder='Ingresa las Notas' 
                                metadata={fields.notes}                            
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button 
                                color="primary" 
                                name='_action'
                                type='submit' 
                                value='addNoPayment'
                                isLoading={isCreating}
                                isDisabled={isCreating}
                            >
                                Agregar Pago
                            </Button>
                        </ModalFooter>
                    </fetcher.Form>
                )
            }
            </>
        )}
        </ModalContent>
    </Modal>
  )
}
