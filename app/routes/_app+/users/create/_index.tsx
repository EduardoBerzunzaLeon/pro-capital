import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@nextui-org/react";
import { Form,  useNavigate, useNavigation } from "@remix-run/react";
import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { InputValidation } from "~/components/ui";
import { SelectRoles } from "~/components/ui/role/SelectRoles";
import { CreateUserSchema } from "~/schemas/userSchema";
import { handlerErrorWithToast, handlerSuccessWithToast } from "~/.server/reponses";
import { ActionFunction } from "@remix-run/node";
import { Service } from "~/.server/services";

export const action: ActionFunction = async({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // formData.set('folder', data['folder[id]']);
    const password = await Service.user.createOne(formData);
    return handlerSuccessWithToast('create', `La contraseña es: ${password}`);
  } catch (error) {
    console.log(error);
    return handlerErrorWithToast(error, data);
  }

}

export default function CreateUser() {

    const navigate = useNavigate();
    const navigation = useNavigation();
    // const lastResult = useActionData<typeof action>();

    // useEffect(() => {
    //   if(lastResult?.status === 'success' && form.value?.anniversaryDate) {
    //     form.reset()
    //   }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [lastResult])


    const onClose = () => {
        navigate(-1)
    }
    
    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: CreateUserSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onBlur',
    }); 
    
    console.log(fields.sex.errors, fields.sex.value);
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
              <ModalHeader className="flex flex-col gap-1">Crear Usuario</ModalHeader>
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
                    label="Nombre de usuario"
                    placeholder="Ingresa el nombre de usuario"
                    metadata={fields.username}
                />
                <InputValidation
                    label="Correo electronico"
                    placeholder="Ingresa el correo electronico"
                    inputType='email'
                    metadata={fields.email}
                />
                <InputValidation
                    label="Dirección"
                    placeholder="Ingresa la dirección"
                    metadata={fields.address}
                />
                <SelectRoles 
                  {...getSelectProps(fields.role)}
                  isInvalid={!!fields.role.errors}
                  color={fields.role.errors ? "danger" : "default"}
                  errorMessage={fields.role.errors}
                />
                <Select
                    items={[{key: 'masculino', value:'MASCULINO'}, {key: 'femenino', value:'FEMENINO'}]}
                    label="Genero"
                    {...getSelectProps(fields.sex)}
                    isInvalid={!!fields.sex.errors}
                    color={fields.sex.errors ? "danger" : "default"}
                    errorMessage={fields.sex.errors}
                    placeholder="Seleccione un genero"
                    labelPlacement="outside"
                    variant="bordered"
                >
                    {
                        (sex) => <SelectItem key={sex.key} textValue={sex.value}>
                            <div className="flex items-center justify-between">
                                <span className='text-center'>{sex.value}</span>
                            </div>
                        </SelectItem>
                    }
                </Select>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} type='button'>
                  Cerrar
                </Button>
                <Button 
                  color="primary" 
                  type='submit'
                  isLoading={navigation.state === 'submitting'}
                  isDisabled={navigation.state !== 'idle'}
                  name='_action'
                  value='create'
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