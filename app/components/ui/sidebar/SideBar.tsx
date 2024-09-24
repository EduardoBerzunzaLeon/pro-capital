import { motion } from "framer-motion";
import "./styles.css";
import { Navigation } from "./Navigation";
import { MenuToggle } from "./MenuToggle";
import { useComponentVisible, useDimensions } from "~/application";

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
  const { ref, isComponentVisible, setIsComponentVisible } =
  useComponentVisible(false);
  const { height } = useDimensions(ref);

  const handlerToggle = ( ) => {
    setIsComponentVisible(!isComponentVisible)
  }

  // TODO: verificar la salida del sidebar, cuando den click fuera del foco
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
  