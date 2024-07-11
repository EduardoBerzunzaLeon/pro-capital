import { Outlet, useLocation  } from "@remix-run/react";
import { motion } from "framer-motion";


export default function Dashboard() {
  const location = useLocation();

  return (
    <>
      {/* <div>App</div> */}
      <Outlet />
      { location?.state?.logged &&
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
              onAnimationStart={(e) => console.log('Animation started: ', e)}
              onAnimationComplete={(e) => console.log('Animation completed: ', e)}
            >Welcome Back Eduardo Berzunza</motion.h2> 
          </>

        )
      }

    </>
  )
}
