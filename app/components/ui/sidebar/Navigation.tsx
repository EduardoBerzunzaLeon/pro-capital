
import { motion, Variants } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { FaHome, FaRoute, FaUsers, FaUsersCog } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaMoneyBillTrendUp, FaPersonDressBurst, FaShield, FaUsersGear } from "react-icons/fa6";

const variants: Variants = {
  open: {
    visibility: 'visible',
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    visibility: ['visible', 'visible', 'hidden'],
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};


export const Navigation = () => (
  <motion.ul variants={variants}>
    {items.map(({icon, text, to, id}) => (
      <MenuItem key={id} icon={icon} text={text} to={to} id={id}/>
    ))}
  </motion.ul>
);



const items = [
  {
    icon: <FaHome />,
    text: "Inicio",
    to: "/",
    id: 1
  },
  {
    icon: <FaShield />,
    text: "Seguridad",
    to: "/security",
    id: 2
  },
  {
    icon: <FaUsersGear />,
    text: "Usuarios",
    to: "/users",
    id: 5
  },
  {
    icon: <FaUsersCog />,
    text: "Asesores",
    to: "/agents",
    id: 6
  },
  {
    icon: <FaRoute />,
    text: "Rutas",
    to: "/region",
    id: 7
  },
  {
    icon: <FaPersonDressBurst />,
    text: "Líderes",
    to: "/leaders",
    id: 8
  },
  {
    icon: <FaUsers />,
    text: "Clientes",
    to: "/clients",
    id: 9
  },
  {
    icon: <FaMoneyBillTrendUp />,
    text: "Reflejar Pagos",
    to: "/pay",
    id: 10
  },
  {
    icon: <IoStatsChartSharp />,
    text: "Reportes",
    to: "/reports",
    id: 11
  },
];