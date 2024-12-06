
import { motion, Variants } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { FaHome, FaRoute, FaUsers, FaUsersCog } from "react-icons/fa";
import { FaMoneyBillTransfer, FaMoneyBillTrendUp, FaPersonDressBurst, FaShield, FaUsersGear } from "react-icons/fa6";
import { Permission } from '../auth/Permission';
import { permissions } from "~/application";

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
    {items.map(({icon, text, to, id, permission}) => {
      return permission
        ?  (
            <Permission key={id} permission={permission}>
              <MenuItem icon={icon} text={text} to={to} id={id}/>
            </Permission>
          )
        : (<MenuItem key={id} icon={icon} text={text} to={to} id={id}/>)
    }
    )}
  </motion.ul>
);

const items = [
  {
    icon: <FaHome />,
    text: "Inicio",
    to: "/",
    id: 1,
  },
  {
    icon: <FaShield />,
    text: "Seguridad",
    to: "/security",
    permission: permissions.roles.permissions.view,
    id: 2
  },
  {
    icon: <FaUsersGear />,
    text: "Usuarios",
    to: "/users",
    permission: permissions.users.permissions.view,
    id: 5
  },
  {
    icon: <FaUsersCog />,
    text: "Asesores",
    to: "/agents",
    permission: permissions.agents.permissions.view,
    id: 6
  },
  {
    icon: <FaRoute />,
    text: "Rutas",
    to: "/region",
    permission: permissions.region.permissions.view,
    id: 7
  },
  {
    icon: <FaPersonDressBurst />,
    text: "Líderes",
    to: "/leaders",
    permission: permissions.leaders.permissions.view,
    id: 8
  },
  {
    icon: <FaUsers />,
    text: "Créditos",
    to: "/clients",
    permission: permissions.credits.permissions.view,
    id: 9
  },
  {
    icon: <FaMoneyBillTransfer />,
    text: "Reflejar Pagos",
    to: "/pay",
    permission: permissions.pays.permissions.view,
    id: 10
  },
  {
    icon: <FaMoneyBillTrendUp />,
    text: "Historial de Pagos",
    to: "/payments",
    permission: permissions.payments.permissions.view,
    id: 11
  }
];