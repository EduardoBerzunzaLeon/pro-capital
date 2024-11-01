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
import { CreditFormEdit } from "~/components/ui/credit/CreditFormEdit";


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
      
      if(data._action === 'update') {
        await Service.credit.updateOne(formData, id);
        return handlerSuccessWithToast('update');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      console.log(error);
      return handlerErrorWithToast(error, data);
    }

}


export default function CreditDetailPage() {
  const loader = useLoaderData<any>();

  const { client, aval, ...credit } = loader.serverData;

  console.log(credit)

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
            { ...client }
            urlAction="clients"
            title='Datos del cliente'
            />
          <PersonFormEdit 
            { ...aval }
            urlAction="aval"
            title='Datos del aval'
          />
        <CreditFormEdit 
          { ...credit }
        />
      </CardBody>
      <CardFooter>
          Visit source code on GitHub.
      </CardFooter>
    </Card>
    
  </>)
}
