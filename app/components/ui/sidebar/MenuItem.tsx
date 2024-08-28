import { NavLink } from "@remix-run/react";
import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};


interface Props  {
  icon: JSX.Element;
  text: string;
  to: string;
  id: number;
}

"flex gap-2 items-center bg-background p-2 pl-4 rounded-lg"
export const MenuItem = ({ icon, text, to, id }: Props) => {
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer list-none"
    >
      <NavLink 
      end
      key={id}
      to={to}
      preventScrollReset
      className={({ isActive, isPending }) =>
        isPending ? "flex gap-2 items-center p-2 pl-4" 
                  : isActive 
                    ? "flex gap-2 items-center bg-background p-2 pl-4 rounded-lg" 
                    : "flex gap-2 items-center"
      }>
        {icon}
        <p>{ text }</p>  
      </NavLink>
    </motion.li>
  );
};
