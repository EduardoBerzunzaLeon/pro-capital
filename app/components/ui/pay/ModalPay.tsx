import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker, Select, SelectItem } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { loader } from "~/routes/_app+/pay/$creditId";
import { paymentSchema, paymentStatus } from "~/schemas";
import { InputValidation } from "../forms/Input";
import { TextareaValidation } from "../forms/Textarea";
import { getLocalTimeZone, today } from "@internationalized/date";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}


export const ModalPay = ({ isOpen, onOpenChange }: Props) => {

    const fetcherGet = useFetcher<typeof loader>({ key:  'getSinglePayment' });
    const fetcher = useFetcher({ key:  'addPayment' });
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isCreating = fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: paymentSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
        defaultValue: {
            folio: 0
        }
      }); 
  
      const calculatePaymentAmount = (paymentAmount: number, currentDebt: number) => {
        return (paymentAmount > currentDebt) 
            ?  currentDebt 
            : paymentAmount;
      }

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
                        <ModalHeader className="flex flex-col gap-1">Relizar Abono de {fetcherGet.data?.serverData?.client.fullname.toUpperCase()}</ModalHeader>
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
                            <InputValidation
                                label="Pago"
                                placeholder="Ingresa el monto a pagar"
                                metadata={fields.paymentAmount}
                                inputType='number'
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                      <span className="text-default-400 text-small">$</span>
                                    </div>
                                }
                                defaultValue={calculatePaymentAmount(
                                    fetcherGet.data?.serverData?.paymentAmount,
                                    fetcherGet.data?.serverData?.currentDebt,
                                )+''}
                            />
                             <Select 
                                variant='bordered'
                                labelPlacement="outside"
                                label='Tipo de credito'
                                disallowEmptySelection
                                defaultSelectedKeys={['PAGO']}
                                {...getSelectProps(fields.status)}
                            >
                                {
                                    paymentStatus.map((value) => (
                                        <SelectItem key={value}>{value.replace('_', ' ')}</SelectItem> 
                                    ))
                                }
                            </Select>
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
                                value='addPayment'
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
