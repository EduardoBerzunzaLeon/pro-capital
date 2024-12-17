import { Card, CardHeader, Divider, CardBody, useDisclosure } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { redirectWithWarning } from "remix-toast";
import { 
  handlerSuccess, 
  handlerError, 
  handlerSuccessWithToast, 
  handlerErrorWithToast 
} from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "~/application";
import { ChipStatusCredit, PersonFormEdit } from "~/components/ui";
import { CreditFormEdit } from "~/components/ui/credit/CreditFormEdit";
import { ButtonAddPayment, ModalPay } from "~/components/ui/pay";
import { Permission } from '~/components/ui/auth/Permission';
import { ErrorBoundary } from './payments/_layout';
import { FaUserCog, FaUsers } from "react-icons/fa";


export const loader: LoaderFunction = async ({ request, params }) => {
  
  await Service.auth.requirePermission(request, permissions.credits.permissions.view_detail);
  const { creditId } = params;

  try {
    const credit = await Service.credit.findDetailsCredit(creditId);
    return handlerSuccess(200, credit);
  } catch (e) {
    const { error, status } = handlerError(e);
    console.log({error});
    throw new Response(error, { status });
  }

}


export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const id = params.creditId;

  try {
    
      if(data._action === 'delete') {
        await Service.auth.requirePermission(request, permissions.credits.permissions.delete);
        await Service.credit.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }
      
      if(data._action === 'update') {
        await Service.auth.requirePermission(request, permissions.credits.permissions.update);
        await Service.credit.updateOne(formData, id);
        return handlerSuccessWithToast('update');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      console.log(error);
      return handlerErrorWithToast(error, data);
    }

}

export { ErrorBoundary };

export const handle = {
  breadcrumb: (data: { status: string, serverData?: { id: number, client: { fullname: string } } }) => {
      return [
          {
            href: '/clients',
            label: 'Créditos',
            startContent: <FaUsers />,
          },
          {
              href: `/users/${data?.serverData?.id}`,
              label: `Ver crédito`,
              startContent: <FaUserCog />,
          },
      ]
  }
}


export default function CreditDetailPage() {
  const loader = useLoaderData<any>();

  const { client, aval, ...credit } = loader.serverData;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            {
              (credit.currentDebt > 0) && (
                <Permission permission={permissions.payments.permissions.add}>
                  <ButtonAddPayment creditId={credit.id} onPress={onOpen}  />
                </Permission>
              ) 
            }
          </div>
          <p className="text-small text-default-500 capitalize">
            { loader.serverData.folder.name } - { `Grupo ${loader.serverData.group.name}` }
          </p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody className="flex flex-col gap-2">
        <ModalPay isOpen={isOpen} onOpenChange={onOpenChange} />
          <PersonFormEdit 
              { ...client }
              urlAction="clients"
              title='Datos del cliente'
              permission={permissions.credits.permissions.update_client}
          />
          <PersonFormEdit 
              { ...aval }
              urlAction="aval"
              title='Datos del aval'
              permission={permissions.credits.permissions.update_aval}
          />
        <CreditFormEdit 
          { ...credit }
        />
      </CardBody>
    </Card>
    <Permission permission={permissions.payments.permissions.view}>
      <Outlet context={{ client: client.id, folder: credit.folder.id, group:  credit.group.id }}/>
    </Permission>
  </>)
}
