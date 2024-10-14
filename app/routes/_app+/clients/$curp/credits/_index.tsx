import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params, request }) => {
    const url = new URL(request.url);

    const curp = { column: 'client.curp', value: params?.curp ?? '' }
    const status = { column: 'status', value: [ 'VENCIDO', 'ACTIVO', 'RENOVADO' ]}

    const page = url.searchParams.get('pc') || 1;
    const limit = url.searchParams.get('lc') || 5;
    const column = url.searchParams.get('cc') || 'folder.name';
    const direction = url.searchParams.get('dc') || 'ascending';

    const pagination = {
        page: Number(page),
        limit: Number(limit),
        column,
        direction,
        search: [curp, status]
    }

    try {
        const data = await Service.credit.findAll(pagination);
        console.log({data});
        return data;

    } catch (err) {
        console.log({err});
        return [];
    }

}


export default function ViewCreditsPage () {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const loader = useLoaderData();

    console.log({loader});
    
    const onClose = () => {
        navigate(`/clients?${params}`)
    }

    return (
    <Modal 
        isOpen={true}
        onClose={onClose}
        placement="top-center"
        className='red-dark text-foreground bg-content1'
        isDismissable={false}
    >
        <ModalContent>
          {(onClose) => (
            <>
              <Form method='post'>
              <ModalHeader className="flex flex-col gap-1">Créditos de JUANCHO</ModalHeader>
              <ModalBody>
            
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} type='button'>
                  Close
                </Button>
                <Button color="primary" type='submit'>
                  Crear nuevo crédito
                </Button>
              </ModalFooter>
              </Form>
            </>

          )}
        </ModalContent>
      </Modal>
    )
}