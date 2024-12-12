import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Outlet, UIMatch, useLoaderData, useLocation, useMatches, useNavigationType, useRouteLoaderData} from "@remix-run/react";
import { type MetaFunction } from "@remix-run/node";
import { FaHome } from "react-icons/fa";
import { LogginEnd } from "~/components/ui";
import { dashboardLoader } from "~/application/dashboard/dashboard.loader";
import Navbar from "~/components/ui/navbar/Narbar";
import SideBar from "~/components/ui/sidebar/SideBar";
import { User } from "@prisma/client";
import { ErrorBoundary } from '../../components/ui/error/ErrorBoundary';
import { ShouldRevalidateFunction } from 'react-router-dom';

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate
}) => {

  if(nextUrl.search !== currentUrl.search) return false;
  return defaultShouldRevalidate;
};

export { ErrorBoundary }

export const handle = {
  breadcrumb: () => ({
    href:'/',
    label:'Inicio',
    startContent: <FaHome />
  })
}

interface BreadCrumbI {
  href: string;
  startContent: JSX.Element;
  label: string;
}


type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => BreadCrumbI | BreadCrumbI[] }
>


export default function Dashboard() {
  
  const location = useLocation();
  const matches = (useMatches() as unknown as BreadcrumbMatch[]).filter(
    ({ handle }) => handle?.breadcrumb
  )
  const navigationType = useNavigationType();
  const { user } = useRouteLoaderData('root') as { user: User };
  const data = useLoaderData<typeof dashboardLoader>();

  console.log(matches);

  return (
    <>
        <SideBar />
        <Navbar />
        <Breadcrumbs className="flex w-11/12  justify-end m-auto pt-5" >
          { matches.map(({ handle, data }, i) => {
              const bread = handle.breadcrumb(data); 

              if( !Array.isArray(bread) ) {
                return (
                  <BreadcrumbItem startContent={bread.startContent} href={bread.href} key={i}>
                    { bread.label }
                  </BreadcrumbItem> 
                )
              }

              return bread.map(({startContent, href, label}, j) => {
                return (
                  <BreadcrumbItem startContent={startContent} href={href} key={(j+1)*100}>
                    { label }
                  </BreadcrumbItem> 
                )
              })
          })}
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