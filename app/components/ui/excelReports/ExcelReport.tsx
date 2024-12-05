import { Button, Tooltip } from '@nextui-org/react';
import { FaFileExcel } from 'react-icons/fa';
import { useFetcher } from '@remix-run/react';

interface Props {
    url: string,
    name: string
}

export const ExcelReport = ({ url, name }: Props) => {

    console.log({ name });
    const { Form, state, data } = useFetcher();


    console.log({data});

  return (
    <Form
        action={url}
        method='GET'
    >
        <Tooltip
            content={
                <div className="px-1 py-2">
                    <div className="text-small font-bold">Exporta la tabla en excel</div>
                    <div className="text-tiny">Los datos exportados dependen de los filtros</div>
                </div>
            }
        >
            <Button 
                variant='ghost'
                color='success'
                isIconOnly
                type='submit'
                isLoading={state !== 'idle'}
                isDisabled={state !== 'idle'}
            ><FaFileExcel /></Button>
        </Tooltip>
    </Form>
  )
}
