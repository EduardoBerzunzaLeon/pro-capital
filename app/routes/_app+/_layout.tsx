import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Outlet, useLoaderData, useLocation, useNavigationType, useRouteLoaderData} from "@remix-run/react";
import { type MetaFunction } from "@remix-run/node";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import { LogginEnd } from "~/components/ui";
import { dashboardLoader } from "~/application/dashboard/dashboard.loader";
import Navbar from "~/components/ui/navbar/Narbar";
import SideBar from "~/components/ui/sidebar/SideBar";
import { User } from "@prisma/client";

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};

export default function Dashboard() {
  
  const location = useLocation();
  const navigationType = useNavigationType();
  const { user } = useRouteLoaderData('root') as { user: User };
  const data = useLoaderData<typeof dashboardLoader>();
  
  return (
    <>
        <SideBar />
        <Navbar />
        <Breadcrumbs className="flex w-11/12  justify-end m-auto pt-5">
          <BreadcrumbItem href='/'
            startContent={<FaHome />}
          >Inicio</BreadcrumbItem>
          <BreadcrumbItem href='/clients'
            startContent={<FaUsers />}
          >Clientes</BreadcrumbItem>
          <BreadcrumbItem href='/clients/1'
            startContent={<FaUser />}
          >Cliente A</BreadcrumbItem>
        </Breadcrumbs>

        <section className="w-11/12 flex flex-col items-center justify-start m-auto pt-5 pb-3">
          <Outlet />  
        </section>
      { 
        ( 
         data?.message 
         && (
          data.message === 'welcome to app' && 
          navigationType === 'PUSH' && 
          location?.state?._isRedirect
        )
        ) && 
          ( <LogginEnd text={`Bienvenido de nuevo, ${user?.name.toUpperCase()}`} /> )
      }
    </>
  )
}


export { dashboardLoader as loader };