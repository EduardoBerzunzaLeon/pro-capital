import { Card, CardHeader, Divider, CardBody, CardFooter, Dropdown, Button, DropdownItem, DropdownMenu, DropdownTrigger, ButtonGroup, Input } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { redirectWithWarning } from "remix-toast";
import { 
  handlerSuccess, 
  handlerError, 
  handlerSuccessWithToast, 
  handlerErrorWithToast 
} from "~/.server/reponses";
import { Service } from "~/.server/services";
import { ChipStatusCredit, PersonFormEdit } from "~/components/ui";


export const loader: LoaderFunction = async ({ params }) => {
  
  const { creditId } = params;

  try {
  
    const credit = await Service.credit.findDetailsCredit(creditId);
    return handlerSuccess(200, credit);
  } catch (error) {
    console.log({error});
    return handlerError(error);
  }

}


export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const id = params.creditId;

  try {
    
      if(data._action === 'delete') {
        await Service.credit.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      console.log(error);
      return handlerErrorWithToast(error, data);
    }

}


export default function CreditDetailPage() {
  const loader = useLoaderData<any>();

  return (<>
    <Card className='w-full'>
      <CardHeader>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between flex-row">
            <p className="text-md">Crédito de <span className='font-bold'>{ 
              loader.serverData.client.fullname.toUpperCase()
            }</span>
            </p>
            <ChipStatusCredit 
              status={loader.serverData.status}
            />
            <ButtonGroup>
              <Dropdown className="red-dark text-foreground bg-content1">
              <DropdownTrigger>
                <Button 
                  variant="ghost" 
                  endContent={<FaEdit />}
                >
                  Editar
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="new">Datos del cliente</DropdownItem>
                <DropdownItem key="copy">Datos del aval</DropdownItem>
                <DropdownItem key="edit">Datos del crédito</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              variant='ghost'
              endContent={<FaPlus />} 
            >
              Agregar Pago
            </Button>
            </ButtonGroup>
          </div>
          <p className="text-small text-default-500 capitalize">
            { loader.serverData.folder.name } - { `Grupo ${loader.serverData.group.name}` }
          </p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody className="flex flex-col gap-2">
          <PersonFormEdit 
            { ...loader.serverData.client }
            urlAction="clients"
            title='Datos del cliente'
            />
          <PersonFormEdit 
            { ...loader.serverData.aval }
            urlAction="aval"
            title='Datos del aval'
          />

        <Card>
          <CardHeader>
            Datos del Crédito
          </CardHeader>
          <CardBody>
            <Input
              label='Cantidad Total'
              value={loader.serverData.totalAmount}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Deuda Actual'
              value={loader.serverData.currentDebt}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Pago Semanal'
              value={loader.serverData.paymentAmount}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Siguiente Pago'
              value={loader.serverData.nextPayment}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Ultimo Pago'
              value={loader.serverData.lastPayment}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Cantidad'
              value={loader.serverData.amount}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Estatus'
              value={loader.serverData.status}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Tipo de crédito'
              value={loader.serverData.type}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Garantia del cliente'
              value={loader.serverData.clientGuarantee}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Garantia del aval'
              value={loader.serverData.avalGuarantee}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Carpeta'
              value={loader.serverData.folder.name}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            /> 
            <Input
              label='Grupo'
              value={loader.serverData.group.name}
              variant='bordered'
              labelPlacement="outside"
              isReadOnly
            />
          </CardBody>
        </Card>
      </CardBody>
      <CardFooter>
          Visit source code on GitHub.
      </CardFooter>
    </Card>
    
  </>)
}
