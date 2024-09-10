import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { InputValidation } from "~/components/ui";
import { AutocompleteCombobox } from "~/components/ui/forms/Autocomplete";
import { CreateLeaderSchema } from "~/schemas/leaderSchema";
import {I18nProvider} from "@react-aria/i18n";

export const action: ActionFunction = async({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    formData.set('folder', data['folder[id]']);
     await Service.leader.createOne(formData);
    return handlerSuccessWithToast('create');
  } catch (error) {
    console.log(error);
    return handlerErrorWithToast(error, data);
  }

}

export default function CreateLeader() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const lastResult = useActionData<typeof action>();

    useEffect(() => {
      if(lastResult?.status === 'success' && form.value?.anniversaryDate) {
        form.reset()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastResult])

    const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: CreateLeaderSchema });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onInput',
    }); 
    
    console.log({error: form.allErrors})
    const onClose = () => {
        navigate(-1)
    }

    return (
        <Modal 
        isOpen={true}
        onClose={onClose}
        placement="top-center"
        className='red-dark text-foreground bg-content1'
        isDismissable={false}
        scrollBehavior='outside'
    >
        <ModalContent>
          {(onClose) => (
            <>
              <Form 
                method='post'
                { ...getFormProps(form) }
              >
              <ModalHeader className="flex flex-col gap-1">Crear Líder</ModalHeader>
              <ModalBody>
              <InputValidation
                  label="Nombre(s)"
                  placeholder="Ingresa el/los nombre(s)"
                  metadata={fields.name}
              />
              <InputValidation
                  label="Primer Apellido"
                  placeholder="Ingresa el primer apellido"
                  metadata={fields.lastNameFirst}
              />
              <InputValidation
                  label="Segundo Apellido"
                  placeholder="Ingresa el segundo apellido"
                  metadata={fields.lastNameSecond}
              />
              <InputValidation
                  label="Dirección"
                  placeholder="Ingresa la dirección"
                  metadata={fields.address}
              />
              <InputValidation
                  label="CURP"
                  placeholder="Ingresa la CURP"
                  metadata={fields.curp}
              />
              <DatePicker 
                  label="Fecha de nacimiento" 
                  showMonthAndYearPickers
                  variant='bordered' 
                  id='birthday'
                  key={fields.birthday.key}
                  name={fields.birthday.name}
                  isInvalid={!!fields.birthday.errors}
                  errorMessage={fields.birthday.errors}
                  granularity="day"
               />
                     <I18nProvider locale="es-MX">
                      <DatePicker 
                          label="Fecha de asignación" 
                          variant='bordered' 
                          id='anniversaryDate'
                          key={fields.anniversaryDate.key}
                          name={fields.anniversaryDate.name}
                          isInvalid={!!fields.anniversaryDate.errors}
                          errorMessage={fields.anniversaryDate.errors}
                          defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                          granularity="day"
                      />
                     </I18nProvider>
                <AutocompleteCombobox 
                  keyFetcher='findFolderAutocomplete' 
                  actionRoute='/folder/search' 
                  label='Carpeta' 
                  comboBoxName='folder' 
                  placeholder='Ingresa la carpeta'       
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} type='button'>
                  Close
                </Button>
                <Button 
                  color="primary" 
                  type='submit'
                  isLoading={navigation.state === 'submitting'}
                  isDisabled={navigation.state !== 'idle'}
                  name='_action'
                >
                  Crear
                </Button>
              </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  }
  