import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { MenuToggle } from "./MenuToggle";
import { useComponentVisible, useDimensions } from "~/application";
import { useLocation } from "@remix-run/react";
import { useEffect } from "react";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    height: ['100%', '100%'],
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(25px at 40px 33px)",
    height: '64px',
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export default function SideBar() {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const { height } = useDimensions(ref);
  const { pathname } = useLocation();

  

  useEffect(() => {
    setIsComponentVisible(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handlerToggle = ( ) => {
    setIsComponentVisible(!isComponentVisible)
  }

  return (
      <motion.nav
        initial={false}
        animate={isComponentVisible ? "open" : "closed"}
        custom={height}
        ref={ref}
        className="sidebar"
      >
        <motion.div className="background bg-content2" variants={sidebar} />
        <Navigation/>
        <MenuToggle toggle={handlerToggle} />
      </motion.nav>
  );
  } 
  