import { Chip } from "@nextui-org/react";


interface Props {
    isActive: boolean;
}

export const ChipStatus = ({ isActive }: Props) => {
    const status = isActive ? 'Activo' : 'Inactivo';
    const color = isActive ? 'success' : 'danger' 
    
    return ( <Chip color={color} variant="bordered" >{status}</Chip>)
}