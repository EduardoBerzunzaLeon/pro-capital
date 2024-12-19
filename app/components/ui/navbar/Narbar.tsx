import {
    Navbar as NavbarNextUI, 
    NavbarBrand, 
    NavbarContent, 
    Image,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger
} from "@nextui-org/react";

import logo from '../../../../img/icon_logo.png';
import { useNavigate, useRouteLoaderData, useSubmit } from "@remix-run/react";
import { User } from "~/.server/domain/entity";
import { FaUser } from "react-icons/fa";


export default function Navbar() {
  const { user } = useRouteLoaderData('root') as { user: User};
  const submit  = useSubmit();
  const navigate = useNavigate();
  // const [action, setAction] = useState<string | number>('');
  const onActionChange = (key: string | number) => {

    if(key === 'logout') {
      return submit({ key }, {
         method: 'POST', 
         action:'logout'
      }); 
    }

    if(key === 'profile') {
      return navigate('/profile'); 
    }

    console.log({key: 'SETTINGS NOT IMPLEMENTATED'}); 
  }

  
  return (
    
      <NavbarNextUI
        isBordered
        maxWidth="full"
        className="overflow-visible"
      >
        <NavbarContent justify="start">
          <div />
        </NavbarContent>

        <NavbarContent justify="center">
          <NavbarBrand>
            <Image
                alt="logo pro-capital"
                height={40}
                src={logo}
                width={40}
            />
            <p className="font-bold text-inherit ml-2">PRO CAPITAL</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="end"> 
        <Dropdown placement="bottom-end" className="red-dark text-foreground bg-content1">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={user?.username}
              size="sm"
              src={`/img/${user.avatar}`}
              showFallback
              fallback={
                <FaUser size={15}/>
              }
            />
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Profile Actions" 
            variant="flat"
            onAction={onActionChange}
          >
            <DropdownItem 
              key="profile" 
              className="h-14 gap-2"
              textValue="profile"
            >
              <p className="font-semibold">inicio de sesión</p>
              <p className="font-semibold">{user?.username}</p>
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              color="danger"
              textValue='logout'
              className="text-danger"
            >
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        </NavbarContent>
      </NavbarNextUI>
  );
}