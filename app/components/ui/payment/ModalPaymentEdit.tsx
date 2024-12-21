import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, DatePicker } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { paymentSchema, paymentStatus } from "~/schemas";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { InputValidation } from "../forms/Input";
import { action, loader } from "~/routes/_app+/payments/$paymentId/_index";
import { AutocompleteValidation } from "../forms/AutocompleteValidation";
import { parseDate } from "@internationalized/date";
import { TextareaValidation } from "../forms/Textarea";
import { useEffect } from "react";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}


export function ModalPaymentEdit({
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher<typeof action>();
    const fetcherGet = useFetcher<typeof loader>({ key: 'getPayment' });
    // const [selected, setSelected] = useState<Autocomplete | undefined>({id: -1, value: ''});
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isUpdating = fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

 
    const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: paymentSchema });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onInput',
    }); 

    useEffect(() => {
        if(!isOpen && form?.status === 'error') {
            form?.reset()        
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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
              loadingMessage='Buscando el pago'
              error={fetcherGet.data?.error}             
            />
              {
                 (isVisible) &&
                   (
                    <>
                    <fetcher.Form 
                      method='POST' 
                      action={`/payments/${fetcherGet.data?.serverData.id}`}
                      { ...getFormProps(form)}
                    >
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar Pago de { fetcherGet.data?.serverData.credit.client.fullname.toUpperCase() }
                        </ModalHeader>
                        <ModalBody>
                        <span>
                            Carpeta: <span className="capitalize font-bold">{fetcherGet.data?.serverData?.credit.folder.name}</span>
                        </span>
                        <span>
                            Grupo: <span className="capitalize font-bold">{fetcherGet.data?.serverData?.credit.group.name}</span>
                        </span>
                        <span>
                            Deuda Actual: <span className="capitalize font-bold">${fetcherGet.data?.serverData?.credit.currentDebt}</span>
                        </span>
                            <AutocompleteValidation 
                                keyFetcher='findAgentAutocomplete' 
                                actionRoute='/users/agentsSearch' 
                                label='Agente' 
                                comboBoxName='agent' 
                                placeholder='Ingresa el agente' 
                                metadata={fields.agent}      
                                defaultValue={{ id: fetcherGet.data?.serverData.agent.id, value: fetcherGet.data?.serverData.agent.fullName ?? '' }}
                                isRequired
                            />
                            <InputValidation
                                label="Pago"
                                placeholder="Ingresa el monto a pagar"
                                metadata={fields.paymentAmount}
                                inputType='number'
                                isRequired
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                      <span className="text-default-400 text-small">$</span>
                                    </div>
                                }
                                defaultValue={fetcherGet.data?.serverData?.paymentAmount}
                            />
                            <Select 
                                variant='bordered'
                                labelPlacement="outside"
                                label='Tipo de pago'
                                disallowEmptySelection
                                isRequired
                                selectedKeys={[fetcherGet.data?.serverData?.status || 'PAGO']}
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
                                defaultValue={parseDate(fetcherGet.data?.serverData?.paymentDate.substring(0,10))}
                                granularity="day"
                                isRequired
                            />
                            <InputValidation
                                label="Folio"
                                placeholder="Ingresa el folio"
                                metadata={fields.folio}
                                inputType='number'
                                defaultValue={fetcherGet.data?.serverData?.folio || 0}
                            />
                            <TextareaValidation 
                                label='Notas' 
                                placeholder='Ingresa las Notas' 
                                metadata={fields.notes}
                                defaultValue={fetcherGet.data?.serverData?.notes}                            
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
                                Actualizar Pago
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