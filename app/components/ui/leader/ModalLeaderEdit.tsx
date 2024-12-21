import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { Autocomplete, Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { ModalBodyHandler } from "~/components/utils/ModalBodyHandler";
import { CreateLeaderSchema } from "~/schemas/leaderSchema";
import { AutocompleteCombobox } from "../forms/Autocomplete";
import { InputValidation } from "../forms/Input";
import { parseDate } from "@internationalized/date";
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void
}

export function ModalLeaderEdit({
        isOpen, 
        onOpenChange 
    }: Props) {
    
    const fetcher = useFetcher<HandlerSuccess<Generic>>();
    const fetcherGet = useFetcher<HandlerSuccess<Generic>>({ key: 'getLeader' });
    const [selected, setSelected] = useState<Autocomplete | undefined>({id: -1, value: ''});
    const isVisible = fetcherGet.state === 'idle' && fetcherGet.data?.serverData?.id;
    const isUpdating = fetcher.state !== 'idle' || fetcherGet.state !== 'idle';

    const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: CreateLeaderSchema });
      },
      lastResult: fetcherGet.data?.serverData,
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onInput',
    }); 

    // console.log(fetcherGet);

    useEffect(() => {
      if(fetcherGet?.data?.serverData?.folder?.id) {
        setSelected({
          id: fetcherGet?.data?.serverData?.folder?.id,
          value:  fetcherGet?.data?.serverData?.folder?.name ?? ''
        });
      }
    }, [fetcherGet.data])

    return (
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        className='red-dark text-foreground bg-content1'
        isDismissable={false}
        scrollBehavior='outside'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBodyHandler 
                state={fetcherGet.state} 
                loadingMessage='Buscando a la líder'
                error={fetcherGet.data?.error}             
              />
              {
                 (isVisible) &&
                   (
                    <>
                    <fetcher.Form 
                      method='POST' 
                      action={`/leaders/${fetcherGet.data?.serverData.id}`}
                      { ...getFormProps(form)}
                    >
                        <ModalHeader className="flex flex-col gap-1">
                            Actualizar la Líder {fetcherGet.data?.serverData.fullname.toUpperCase()}
                        </ModalHeader>
                        <ModalBody>
                          <InputValidation
                              label="Nombre(s)"
                              placeholder="Ingresa el/los nombre(s)"
                              metadata={fields.name}
                              defaultValue={fetcherGet.data?.serverData?.name}
                              isRequired
                          />
                          <InputValidation
                              label="Primer Apellido"
                              placeholder="Ingresa el primer apellido"
                              metadata={fields.lastNameFirst}
                              defaultValue={fetcherGet.data?.serverData?.lastNameFirst}
                              isRequired
                          />
                          <InputValidation
                              label="Segundo Apellido"
                              placeholder="Ingresa el segundo apellido"
                              metadata={fields.lastNameSecond}
                              defaultValue={fetcherGet.data?.serverData?.lastNameSecond}
                          />
                          <InputValidation
                              label="Dirección"
                              placeholder="Ingresa la dirección"
                              metadata={fields.address}
                              defaultValue={fetcherGet.data?.serverData?.address}
                              isRequired
                          />
                          <InputValidation
                              label="CURP"
                              placeholder="Ingresa la CURP"
                              metadata={fields.curp}
                              defaultValue={fetcherGet.data?.serverData?.curp}
                              isRequired
                          />
                          <DatePicker 
                              label="Fecha de nacimiento" 
                              variant='bordered' 
                              id='birthday'
                              key={fields.birthday.key}
                              name={fields.birthday.name}
                              isInvalid={!!fields.birthday.errors}
                              errorMessage={fields.birthday.errors}
                              defaultValue={parseDate(fetcherGet.data?.serverData?.birthday.substring(0,10))}
                              granularity="day"
                              isRequired
                          />
                            <DatePicker 
                                label="Fecha de asignación" 
                                variant='bordered' 
                                id='anniversaryDate'
                                key={fields.anniversaryDate.key}
                                name={fields.anniversaryDate.name}
                                isInvalid={!!fields.anniversaryDate.errors}
                                errorMessage={fields.anniversaryDate.errors}
                                defaultValue={parseDate(fetcherGet.data?.serverData?.anniversaryDate.substring(0,10))}
                                granularity="day"
                                isRequired
                            />
                            <AutocompleteCombobox 
                              keyFetcher='findFolderAutocomplete' 
                              actionRoute='/folder/search' 
                              label='Carpeta' 
                              comboBoxName='folder' 
                              placeholder='Ingresa la carpeta'
                              onSelected={setSelected}           
                              selectedItem={selected}       
                              isRequired
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
                                Actualizar
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