import { getFormProps, useForm } from "@conform-to/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react"
import { rangeDatesCreditSchema } from "~/schemas/creditSchema"
import { parseWithZod } from "@conform-to/zod"
import { useFetcher } from "@remix-run/react"
import { getLocalTimeZone, today } from "@internationalized/date"


interface Props {
    isOpen: boolean,
    onOpenChange: () => void
}


export const ModalExportStatistics = ({ isOpen, onOpenChange }: Props) => {

    const fetcher = useFetcher<any>();

    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: rangeDatesCreditSchema });
        },
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
            <fetcher.Form
                method='GET'
                action={`/clients/statistics`}
                { ...getFormProps(form) }
            >
              <ModalHeader className="flex flex-col gap-1">
                Exportar a excel las estadisticas
              </ModalHeader>
              <ModalBody>
                <DatePicker 
                    label="Fecha de inicio" 
                    variant='bordered' 
                    id='start'
                    key={fields.start.key}
                    name={fields.start.name}
                    isInvalid={!!fields.start.errors}
                    errorMessage={fields.start.errors}
                    defaultValue={today(getLocalTimeZone())}
                    granularity="day"
                />
                <DatePicker 
                    label="Fecha de fin" 
                    variant='bordered' 
                    id='end'
                    key={fields.end.key}
                    name={fields.end.name}
                    isInvalid={!!fields.end.errors}
                    errorMessage={fields.end.errors}
                    defaultValue={today(getLocalTimeZone())}
                    granularity="day"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button 
                    color="success" 
                    variant='bordered' 
                    type='submit' 
                    name='_action'
                    value='exportLayout' 
                    isLoading={fetcher.state !== 'idle'}
                    isDisabled={fetcher.state !== 'idle'}
                >
                  Exportar
                </Button>
              </ModalFooter>
            </fetcher.Form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}