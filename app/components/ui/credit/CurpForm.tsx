import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { curpSchema } from "~/schemas/genericSchema";
import { InputValidation } from "../forms/Input";
import { useFetcher } from "@remix-run/react";

export const CurpForm = () => {

    const fetcher = useFetcher();
        
    const [form, fields] = useForm({
        onValidate({ formData }) {
          return parseWithZod(formData, { schema: curpSchema });
        },
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
    }); 

  return (
    <Card className='w-full'>
        <CardHeader>
            Verificación para crear un credito
        </CardHeader>
        <Divider/>
      <CardBody>
        <fetcher.Form
            method='POST'
            {...getFormProps(form)}
        >
            <InputValidation
                label="CURP"
                placeholder="Ingresa la CURP"
                metadata={fields.curp}
            />
            <Button  
                color="primary" 
                type='submit' 
                name='_action' 
                value='verify'
                className='mt-2'
                isLoading={fetcher.state !== 'idle'}
                isDisabled={fetcher.state !== 'idle'}
            >
                Verificar
            </Button>
        </fetcher.Form>
      </CardBody>
    </Card>
  )
}
