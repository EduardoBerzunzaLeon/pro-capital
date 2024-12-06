import { usePermission } from '../../../application/hook';
import { DropdownItem } from '@nextui-org/react';

interface Props {
    permission: string,
    key: string,
    label: string,
    startContent?: React.ReactNode
}

export const DropdownItemPermission = ( { 
    permission, key, label, startContent 
}: Props ) => {

   const { hasPermission } = usePermission({ permission })

  if(!hasPermission) {
    return <></>;
  }
  

  return (
    <DropdownItem
        key={key}
        startContent={startContent}
    >{label}</DropdownItem>
  )
}