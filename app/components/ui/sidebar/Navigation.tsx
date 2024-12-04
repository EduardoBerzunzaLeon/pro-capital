
import { motion, Variants } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { FaHome, FaRoute, FaUsers, FaUsersCog } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaMoneyBillTransfer, FaMoneyBillTrendUp, FaPersonDressBurst, FaShield, FaUsersGear } from "react-icons/fa6";
import { Permission } from '../auth/Permission';

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
    {items.map(({icon, text, to, id, permission}) => (
      <Permission key={id} permission={'clients[view]'}>
        <MenuItem icon={icon} text={text} to={to} id={id}/>
      </Permission>
    ))}
  </motion.ul>
);

const items = [
  {
    icon: <FaHome />,
    text: "Inicio",
    to: "/",
    id: 1,
    permission: 'dashboard[view]',
  },
  {
    icon: <FaShield />,
    text: "Seguridad",
    to: "/security",
    permission: 'security[view]',
    id: 2
  },
  {
    icon: <FaUsersGear />,
    text: "Usuarios",
    to: "/users",
    permission: 'users[view]',
    id: 5
  },
  {
    icon: <FaUsersCog />,
    text: "Asesores",
    to: "/agents",
    permission: 'agents[view]',
    id: 6
  },
  {
    icon: <FaRoute />,
    text: "Rutas",
    to: "/region",
    permission: 'region[view]',
    id: 7
  },
  {
    icon: <FaPersonDressBurst />,
    text: "Líderes",
    to: "/leaders",
    permission: 'leaders[view]',
    id: 8
  },
  {
    icon: <FaUsers />,
    text: "Clientes",
    to: "/clients",
    permission: 'clients[view]',
    id: 9
  },
  {
    icon: <FaMoneyBillTransfer />,
    text: "Reflejar Pagos",
    to: "/pay",
    permission: 'pay[view]',
    id: 10
  },
  {
    icon: <FaMoneyBillTrendUp />,
    text: "Historial de Pagos",
    to: "/payments",
    permission: 'payments[view]',
    id: 11
  },
  {
    icon: <IoStatsChartSharp />,
    text: "Reportes",
    to: "/reports",
    permission: 'reports[view]',
    id: 12
  },
];