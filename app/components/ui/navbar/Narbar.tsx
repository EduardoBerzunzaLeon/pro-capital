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
import { useNavigate } from "@remix-run/react";

export default function Navbar() {

  const navigate = useNavigate();

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
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Profile Actions" 
            variant="flat"
            onAction={(key) => {
             
              if(key === 'logout') return navigate('/login')
            }}
          >
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        </NavbarContent>
      </NavbarNextUI>
  );
}