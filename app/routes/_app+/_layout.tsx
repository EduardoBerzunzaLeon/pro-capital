import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Outlet, useLocation, useNavigationType} from "@remix-run/react";
import { motion } from "framer-motion";
import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import Navbar from "~/components/ui/navbar/Narbar";
import SideBar from "~/components/ui/sidebar/SideBar";


export default function Dashboard() {
  const location = useLocation();
  const navigationType = useNavigationType();

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
      { (location?.state?.logged && navigationType === 'PUSH') &&
        (
          <> 
          <motion.div
            initial={{ scale: 100 }}
            animate={{ 
              opacity: 0,
              scale: [ 100, 100, 100, 0 ],
              transition: {
                duration: 1.3, delay: .5
              }
            }}
            className="privacy-screen"
            >
            {/* <motion.h2>Welcome Back Eduardo Berzunza</motion.h2>  */}
            </motion.div> 
            <motion.h2
              className='text-lg text-center privacy-text'
              initial={{ opacity: 1 }}
              animate={{ 
                opacity: 0,
                transition: {
                  duration: .5
                }
               }}
            >Welcome Back Eduardo Berzunza</motion.h2> 
          </>

        )
      }

    </>
  )
}
