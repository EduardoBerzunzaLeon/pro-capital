import React, { useEffect, useMemo } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Card, CardHeader, CardBody, Input, Image, Button, Divider } from "@nextui-org/react";
import { FaEye , FaEyeSlash  } from "react-icons/fa6";
import { toast } from "react-toastify";

import logo from '../../../img/icon_logo.png';
import { loginAction } from "~/application/login/login.action";
import { loginSchema } from "~/schemas";
import { usePresence } from "framer-motion";


export default function LoginPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const actionData = useActionData<typeof loginAction>();
  const navigation = useNavigation();
  const [isPresent, safeToRemove ] = usePresence();

  useEffect(() => {
    if(actionData?.error && actionData) {
      toast.error(actionData?.error);
    }
  }, [actionData]);

  const isSubmitting = useMemo(() => {
    if(!isPresent)  {
      safeToRemove();
      return true;
    }
    return (navigation.state !== "idle");
 }, [isPresent, navigation.state, safeToRemove])

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    lastResult: actionData?.status === 'error' ? actionData : undefined,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  }); 

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card 
      className="py-4 overflow-hidden card_light"
    >
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
    <div className="flip-card ">
        <div className="flip-card__inner bg-content1 border-4 border-primary border-solid rounded-full">
          <div className="flip-card-front">
            <Image
                alt="logo pro-capital"
                className="object-cover"
                height={150}
                src={logo}
                width={150}
            />
          </div>
          <div className="flip-card-back bg-content1  rounded-full p-1">
            <h1 className="text-3xl text-default font-extrabold">PRO CAPITAL</h1> 
            <Divider className="bg-primary w-2/4"  />
            <p className="text-default font-semibold">FINANCIANDO TUS SUEÑOS</p>
          </div>
        </div>
    </div>

      <h4 className="font-bold text-large mt-2">Sistema de Captura y Cobranza</h4>
      <Divider className="mt-2 bg-primary " />
    </CardHeader>
    <CardBody className="overflow-visible py-2 flex gap-4">
    <Form 
      method='post'
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
    <Input
      label="Usuario"
      name={fields.userName.name}
      key={fields.userName.key}
      variant="bordered"
      placeholder="Ingresa tu usuario"
      labelPlacement="outside"
      autoComplete="off"
      // defaultValue="eduardo.berzunza"
      isInvalid={!!fields.userName.errors}
      color={fields.userName.errors ? "danger" : "default"}
      errorMessage={fields.userName.errors}
    />
    <Input
      label="Password"
      name={fields.password.name}
      key={fields.password.key}
      isInvalid={!!fields.password.errors}
      color={fields.password.errors ? "danger" : "default"}
      errorMessage={fields.password.errors}
      // defaultValue="123456"
      variant="bordered"
      placeholder="Ingresa tu contraseña"
      labelPlacement="outside"
      autoComplete="off"
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <FaEye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="max-w-xs"
    />
      <Button 
        color='default'
        variant="ghost"
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
      </Button>
      </Form>  
    </CardBody>
    </Card>
  );
}

export { loginAction as action };

