import { Outlet } from "@remix-run/react";
import {  motion } from "framer-motion";

export default function Signup() {
  return (
  <>
    <div className="h-screen grid place-items-center bg-background" >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 2 }}
      >
        <Outlet />
      </motion.div>
    </div>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 0 }}
      exit={{ 
        scale: 100, 
        transition: { 
          duration: 2, 
          ease: "easeInOut" 
        },
        opacity: 1,
      }}
      className="privacy-screen"
      >
      </motion.div> 
      <motion.h2
        className='text-lg text-center privacy-text'
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 2, delay: 1 }}
      >Welcome Back Eduardo Berzunza</motion.h2> 
    </>
    // </motion.main>
  );
}







{/* <motion.div
initial={{ scaleX: 1 }}
animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
style={{ originX: isPresent ? 0 : 1 }}
className="privacy-screen"
/> */}