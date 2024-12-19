import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { UpdatePasswordSchema } from "~/schemas/userSchema";
import { InputValidation } from "../forms/Input";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
  id: number
}
export const PasswordForm = ({ id }: Props) => {

  const { Form, state } = useFetcher();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: UpdatePasswordSchema });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onBlur',
  }); 

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  return (
    <Card className='sm:max-w-[100%] 2xl:max-w-[800px] min-w-[270px] grow'>
        <Form 
          method='post'
          { ...getFormProps(form) }
          action={`/users/${id}/update`}
        >
          <CardHeader>
              <h2>Actualizar contraseña</h2>
          </CardHeader>
          <CardBody className='flex flex-col gap-3'>
              <InputValidation 
                label="Contraseña" 
                placeholder="Ingresa tu nueva contraseña" 
                metadata={fields.password}          
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                inputType={isVisible ? "text" : "password"}
              />
              <InputValidation 
                label="Confirmar contraseña" 
                placeholder="Ingresa la confirmación de la contraseña" 
                metadata={fields.confirmPassword}         
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirm}>
                    {isVisibleConfirm ? (
                      <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                inputType={isVisibleConfirm ? "text" : "password"} 
              />
          </CardBody>
          <CardHeader>
            <Button 
                color="primary" 
                type='submit' 
                name='_action' 
                value='updatePassword' 
                isLoading={state !== 'idle'}
                isDisabled={state !== 'idle'}
            >
                Actualizar
            </Button>
          </CardHeader>
        </Form>
    </Card>
  )
}
