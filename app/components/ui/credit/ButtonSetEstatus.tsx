import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { IoIosWarning } from "react-icons/io";


export const ButtonSetEstatus = () => {

  const { Form, state } = useFetcher();

  return (
    <Form method='POST'>
        <Button
            variant="bordered"
            color='warning'
            type='submit'
            name='_action'
            value='generate'
            isLoading={state !== 'idle'}
            isDisabled={state !== 'idle'}
            endContent={<IoIosWarning />}
        >
            { 
                state === 'idle' 
                    ? 'Vencer cuentas' 
                    : 'Calculando...' 
            }
        </Button>
    </Form>
  )
}