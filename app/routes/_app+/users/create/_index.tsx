import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@nextui-org/react";
import { Form,  useNavigate, useNavigation } from "@remix-run/react";
import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { InputValidation } from "~/components/ui";
import { SelectRoles } from "~/components/ui/role/SelectRoles";
import { CreateUserSchema } from "~/schemas/userSchema";
import { handlerErrorWithToast } from "~/.server/reponses";
import { ActionFunction } from "@remix-run/node";
import { Service } from "~/.server/services";
import { redirectWithSuccess } from "remix-toast";
import { permissions } from "~/application";

export const action: ActionFunction = async({ request }) => {

  
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const url = new URL(request.url);
  
  try {
    await Service.auth.requirePermission(request, permissions.users.permissions.add);
    const password = await Service.user.createOne(formData);
    return redirectWithSuccess(`/users${url.search}`, { 
      message: `¡Creación exitosa, La contraseña es: ${password} 🎉!`
    });
  } catch (error) {
    return handlerErrorWithToast(error, data);
  }

}

export default function CreateUser() {

    const navigate = useNavigate();
    const navigation = useNavigation();

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
                    isRequired
                />
                <InputValidation
                    label="Primer Apellido"
                    placeholder="Ingresa el primer apellido"
                    metadata={fields.lastNameFirst}
                    isRequired
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
                    isRequired
                />
                <InputValidation
                    label="Correo electronico"
                    placeholder="Ingresa el correo electronico"
                    inputType='email'
                    metadata={fields.email}
                    isRequired
                />
                <InputValidation
                    label="Dirección"
                    placeholder="Ingresa la dirección"
                    metadata={fields.address}
                    isRequired
                />
                <SelectRoles 
                  {...getSelectProps(fields.role)}
                  isInvalid={!!fields.role.errors}
                  color={fields.role.errors ? "danger" : "default"}
                  errorMessage={fields.role.errors}
                  isRequired
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
                    isRequired
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