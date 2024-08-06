import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Outlet, useLocation, useNavigationType} from "@remix-run/react";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import { authenticator } from "~/.server/session";
import { LogginEnd } from "~/components/ui";
import Navbar from "~/components/ui/navbar/Narbar";
import SideBar from "~/components/ui/sidebar/SideBar";


export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};



export default function Dashboard() {
  const location = useLocation();
  const navigationType = useNavigationType();
  console.log({location, navigationType});

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
        ( navigationType === 'PUSH'
        ) && ( <LogginEnd text='Bienvenido de nuevo, Eduardo Berzunza' /> )
      }
    </>
  )
}
