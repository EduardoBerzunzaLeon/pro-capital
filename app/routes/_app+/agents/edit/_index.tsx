import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react";
import {  Form, useNavigate } from "@remix-run/react";
import {  getLocalTimeZone, today } from "@internationalized/date";
// import { handlerSuccess, handlerError, HandlerSuccess } from "~/.server/reponses";
// import { Service } from "~/.server/services";
import { SelectRoutes } from "~/components/ui/route/SelectRoutes";
import { AutocompleteMultiple, ErrorBoundary } from '~/components/ui';
import { useState } from "react";
import { Key } from "~/components/ui/folder/FolderSection";
import { ActionFunction } from "@remix-run/node";
import { ServerError } from "~/.server/errors";
import dayjs from 'dayjs';
import { Service } from "~/.server/services";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { permissions } from "~/application";

export const action: ActionFunction = async({ request }) => {
  await Service.auth.requirePermission(request, permissions.agents.permissions.add);
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const {  route, assignAt, ...agents } = data;
  const keys = Object.keys(agents);

  
  try {
    
    const agentIds: number[] = keys.reduce((acc: number[], key) => {
      if(key.includes('id')) {
        const id = Number(agents[key]);
        if(isNaN(id)) {
          throw ServerError.badRequest('Los agentes seleccionados no son validos.')
        }
        return [
          ...acc,
          Number(id)
        ]
      }
      return acc;
    }, [] );

  await Service.agent.createMany({
    routeId: Number(route), 
    assignAt: dayjs(assignAt+'T00:00:00.000Z').toDate(), 
    agentIds
  });

  return handlerSuccessWithToast('create');
} catch (error) {
  return handlerErrorWithToast(error, data);
}
}


export {
  ErrorBoundary
}

type Selection = 'all' | Set<Key>;

export default function EditAgentRoute () {
    const navigate = useNavigate();
    const [route, setRoute] = useState<number>(0);
    const [assignAt, setAssignAt] = useState(today(getLocalTimeZone()));

    const onClose = () => {
        navigate(-1)
    }

    const handleRouteChange = (routeKey: Selection) => {
      
      if(typeof routeKey === 'string') {
        setRoute(0);
        return;
      } 

      if(routeKey.size === 0)  {
        setRoute(0)
        return;
      }

      const [ routeSingle ] = [...routeKey]
      setRoute(Number(routeSingle));

    }

  return (
    <> 
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
              <ModalHeader className="flex flex-col gap-1">Asignar Rutas a los Asesores</ModalHeader>
              <ModalBody>
                <DatePicker 
                  label="Dia de asignación" 
                  variant='bordered' 
                  name='assignAt'
                  id='assignAt'
                  value={assignAt}
                  onChange={setAssignAt}
                  granularity="day"
                />
                <SelectRoutes 
                  onSelectionChange={handleRouteChange}
                />
                <AutocompleteMultiple 
                  routeId={route}
                  assignAt={assignAt}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} type='button'>
                  Close
                </Button>
                <Button color="primary" type='submit'>
                  Asignar
                </Button>
              </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    
    </>
  )
}