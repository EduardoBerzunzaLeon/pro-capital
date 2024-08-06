// import { Link } from "@remix-run/react";
import { motion, useCycle } from "framer-motion";
import { useRef } from "react";
import { useDimensions } from "~/hook/use-dimensions";
import "./styles.css";
import { Navigation } from "./Navigation";
import { MenuToggle } from "./MenuToggle";

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
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        exit={isOpen ? "closed" : ''}
        custom={height}
        ref={containerRef}
        className="sidebar"
        onAnimationStart={() =>  console.log('endend')}
      >
        <motion.div className="background bg-content2" variants={sidebar} />
        <Navigation/>
        <MenuToggle toggle={() => toggleOpen()} />
      </motion.nav>
  );
  } 
  