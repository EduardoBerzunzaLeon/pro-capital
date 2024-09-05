import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react";
import {  useNavigate } from "@remix-run/react";
import {  now } from "@internationalized/date";
// import { handlerSuccess, handlerError, HandlerSuccess } from "~/.server/reponses";
// import { Service } from "~/.server/services";
import { SelectRoutes } from "~/components/ui/route/SelectRoutes";
import { AutocompleteMultiple } from "~/components/ui";

// TODO: change this
// interface RouteData {
//   id: number,
//   name: number,
//   isActive: boolean
// }

// export const loader: LoaderFunction = async () => {


//     try {
//       const data = await Service.agent.find();
//       return handlerSuccess(200, data);
//     } catch (error) {
//       return handlerError(error);
//     }

// }

export default function EditAgentRoute () {
    const navigate = useNavigate();


    const onClose = () => {
        navigate("/agents")
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
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <DatePicker 
                  label="Dia de asignación" 
                  variant='bordered' 
                  defaultValue={now('America/Mexico_City')}
                  granularity="day"
                />
                <SelectRoutes />
                <AutocompleteMultiple />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    
    </>
  )
}