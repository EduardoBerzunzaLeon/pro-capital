import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, DatePicker, Textarea } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { useForm, getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useEffect } from "react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { UnsubscribeLeaderSchema } from "~/schemas/leaderSchema";

interface Props {
  fullname: string,
  id: number,
  isVisible?: boolean,
  handleSelectedId: (id: number) => void
}

export function ModalUnsubscribeLeader({ fullname, id, handleSelectedId, isVisible }: Props)  {
  const fetcher = useFetcher<HandlerSuccess<Generic>>();

  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const wasUpdated = fetcher.state === 'idle' && fetcher.data?.status === 'success' 
    && isOpen;
  const isUpdating = fetcher.state !== 'idle';

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UnsubscribeLeaderSchema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  }); 

    const handleClose = () => {
        onClose()
        handleSelectedId(0);
    }

    const handleOpenChange = () => {
        onOpenChange();
        handleSelectedId(0);
    }

    useEffect(() => {
        if(wasUpdated) {
          console.log('closed')
            onClose();
            handleSelectedId(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wasUpdated]);


    useEffect(() => {
        if(id > 0 && isVisible) {
            onOpen()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isVisible])

  return (
    <Modal 
    isOpen={isOpen} 
    onOpenChange={handleOpenChange}
    placement="top-center"
    className='red-dark text-foreground bg-content1'
    isDismissable={false}
  >
    <ModalContent>
      {() => (
        <>
                <fetcher.Form 
                  method='POST' 
                  action={`/leaders/${id}`}
                  { ...getFormProps(form)}
                >
                    <ModalHeader className="flex flex-col gap-1">
                        Dar de baja a la líder {fullname.toUpperCase()}
                    </ModalHeader>
                    <ModalBody>
                    <DatePicker 
                      label="Fecha de baja" 
                      variant='bordered' 
                      id='date'
                      key={fields.date.key}
                      name={fields.date.name}
                      isInvalid={!!fields.date.errors}
                      errorMessage={fields.date.errors}
                      defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                      granularity="day"
                    />
                    <Textarea 
                        label='Razón de la baja'
                        labelPlacement="outside"
                        variant='bordered'
                        id='reason'
                        key={fields.reason.key}
                        name={fields.reason.name}
                        isInvalid={!!fields.reason.errors}
                        errorMessage={fields.reason.errors}
                    />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={handleClose}>
                            Cerrar
                        </Button>
                        <Button 
                          color="primary" 
                          type='submit' 
                          name='_action' 
                          value='unsubscribe' 
                          isDisabled={isUpdating}
                          isLoading={isUpdating}
                        >
                            Actualizar
                        </Button>
                    </ModalFooter>
                </fetcher.Form>
        </>
      )}
    </ModalContent>
  </Modal>
  )
}
