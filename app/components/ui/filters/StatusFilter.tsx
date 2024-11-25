import { DropdownStatus } from "../dropdowns/DropdownStatus";
import { useDropdownBoolean } from "~/application";


interface Props {
    isActive?: string,
    param: string,
}

export const StatusFilter = ({ isActive, param }: Props) => {

  const { defaultStatus, handleStatusChange} = useDropdownBoolean({
    value: isActive,
    param,
    trueField: 'active',
    falseField: 'inactive'
  });


  return (
    <DropdownStatus 
        defaultSelectedKeys={defaultStatus}
        onSelectionChange={handleStatusChange} 
    />
  )
}