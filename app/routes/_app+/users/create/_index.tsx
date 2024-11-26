import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@nextui-org/react";
import { Form,  useNavigate, useNavigation } from "@remix-run/react";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { InputValidation } from "~/components/ui";
import { CreateLeaderSchema } from "~/schemas/leaderSchema";
import { SelectRoles } from "~/components/ui/role/SelectRoles";


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
          return parseWithZod(formData, { schema: CreateLeaderSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
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

                {/* TODO: Add conform validation in select roles */}
                <SelectRoles />
                <Select
                    items={[{key: 'masculino', value:'masculino'}, {key: 'femenino', value:'femenino'}]}
                    label="Genero"
                    placeholder="Seleccione un genero"
                    className={`red-dark text-foreground bg-content1`}
                    labelPlacement="outside"
                    variant="bordered"
                    name="sex"
                    id='sex'
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