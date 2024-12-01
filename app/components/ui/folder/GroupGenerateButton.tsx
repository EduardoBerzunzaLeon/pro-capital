import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { IoIosWarning } from "react-icons/io";


export const GroupGenerateButton = () => {

    const { Form, state } = useFetcher();

  return (
    <Form method='POST' action='/folder/group'>
        <Button 
            variant="ghost" 
            color="warning" 
            type='submit'
            name='_action'
            value='generate'
            isLoading={state !== 'idle'}
            isDisabled={state !== 'idle'}
            endContent={<IoIosWarning />}
        >
            { 
                state === 'idle' 
                    ? 'Generar grupos' 
                    : 'Generando...' 
            }
        </Button>
    </Form>
  )
}
