import React from "react";
import { MetaFunction, json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate, useNavigation } from "@remix-run/react";

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { Card, CardHeader, CardBody, Input, Image, Button, Divider } from "@nextui-org/react";


import { FaEye , FaEyeSlash  } from "react-icons/fa6";

import logo from '../../../img/icon_logo.png';

import { getSession } from "~/auth/session";
// import Api from "api";
import { z } from 'zod';

export const meta: MetaFunction = () => {
  return [{ title: "Login" }];
};


const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function action({ request }: ActionFunctionArgs ) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const submission = parseWithZod(body, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const email = body.get("email");
  const password = body.get("password");
  const payload = {
    email,
    password,
  };

  return json(submission.reply());
  // const api = new Api();
  // try {
  //   const response = await api.loginUser(payload);
  //   const sessionPayload = {
  //     token: response.data.access_token,
  //     user: {
  //       email: response.data.user.email,
  //       name: response.data.user.name,
  //     },
  //   };
  //   console.log(response.data.access_token);
  //   session.set("credentials", sessionPayload);
  //   return redirect("/dashboard", {
  //     headers: {
  //       "Set-Cookie": await commitSession(session),
  //     },
  //   });
  // } catch (error: any) {
  //   console.log(error);
  //   return json(error.response.data);
  // }
}


export default function Signup() {
  const [isVisible, setIsVisible] = React.useState(false);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  // const navigate = useNavigate();

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      const validate = parseWithZod(formData, { schema });
      console.log({validate});
      return validate;
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  }); 

  console.log({ email: fields.email})

  const toggleVisibility = () => setIsVisible(!isVisible);
  // console.log(pendingForm);
  // const pending = !!pendingForm;

  return (
    <Card className="py-4 overflow-hidden card_light">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
    <div className="flip-card">
        <div className="flip-card__inner bg-content1 border-4 border-primary border-solid rounded-full">
          <div className="flip-card-front">
            <Image
                alt="Woman listing to music"
                className="object-cover"
                height={200}
                src={logo}
                width={200}
            />
          </div>
          <div className="flip-card-back bg-content1  rounded-full p-1">
            <h1 className="text-3xl text-default font-extrabold">SEDUC</h1> 
            <Divider className="bg-primary w-2/4"  />
            <p className="text-default font-semibold">GOBIERNO DEL ESTADO DE CAMPECHE</p>
          </div>
        </div>
      </div>

      <h4 className="font-bold text-large mt-2">Sistema de Productos de Nómina</h4>
      <Divider className="my-4 bg-primary "  />
    </CardHeader>
    <CardBody className="overflow-visible py-2 flex gap-4">
    <Form 
      method='post'
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
    >
    <Input
          type="email"
          label="Email"
          name={fields.email.name}
          key={fields.email.key}
          variant="bordered"
          placeholder="you@example.com"
          labelPlacement="outside"
          autoComplete="off"
          isInvalid={!!fields.email.errors}
          color={fields.email.errors ? "danger" : "default"}
          errorMessage={fields.email.errors}
          // startContent={
          //   <IoMdMail  className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          // }
        />
    <Input
      label="Password"
      name={fields.password.name}
      key={fields.password.key}
      variant="bordered"
      placeholder="Enter your password"
      labelPlacement="outside"
      autoComplete="off"
      // startContent={
      //   <FaKey  className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      // }
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
        // onClick={() => navigate('../', { state: { logged: true }})}
        type="submit"
        // isLoading
        // className='bg-gradient-to-tr from-pink-500 to-yellow-500'
      >
           {navigation.state === "submitting" ? "Loading..." : "Login"}
      </Button>
      </Form>  
    </CardBody>
    </Card>
  );
}
