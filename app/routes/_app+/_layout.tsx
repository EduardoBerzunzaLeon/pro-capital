import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Outlet, useLocation, useNavigationType} from "@remix-run/react";
import { type MetaFunction } from "@remix-run/node";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import { LogginEnd } from "~/components/ui";
import { dashboardLoader } from "~/application/dashboard/dashboard.loader";
import Navbar from "~/components/ui/navbar/Narbar";
import SideBar from "~/components/ui/sidebar/SideBar";
import { useOptionalUser } from "~/application";

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};

// export const action: ActionFunction = async ({ request }) => {
//   console.log('asdsa')
//   return await authenticator.logout(request, { redirectTo: "/login" });
// };


export default function Dashboard() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const user = useOptionalUser();

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

        <section className="w-11/12 flex flex-col items-center justify-start m-auto pt-5 pb-2">
          <Outlet />  
        </section>
      { 
        ( 
          navigationType === 'PUSH' && location?.state?._isRedirect
        ) && 
          ( <LogginEnd text={`Bienvenido de nuevo, ${user?.name.toUpperCase()}`} /> )
      }
    </>
  )
}


export { dashboardLoader as loader };