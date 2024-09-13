import { useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { Key, Selection } from "~/.server/interfaces";
import { DropdownStatus } from "../dropdowns/DropdownStatus";


interface Props {
    isActive?: string,
    param: string,
}

export const StatusFilter = ({ isActive, param }: Props) => {

    const [ , setSearchParams] = useSearchParams();
    
  const defaultStatus: Selection = useMemo(() => {

    if(!isActive || isActive === 'notUndefined') {
      return new Set(['active','inactive']);
    }

    const selectedStatus: Set<Key> = new Set();

    isActive 
      ? selectedStatus.add('active')
      : selectedStatus.add('inactive');

    return selectedStatus;

  }, [isActive]);

  const handleStatusChange = (keys: Selection) => {
    const data = JSON.stringify(Array.from(keys).map(value => value === 'active'));
    setSearchParams(prev => {
      prev.set(param,data)
      return prev;
    })
  }

  
  return (
    <DropdownStatus 
        defaultSelectedKeys={defaultStatus}
        onSelectionChange={handleStatusChange} 
    />
  )
}