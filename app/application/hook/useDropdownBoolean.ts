import { useMemo } from "react";
import { useSearchParams } from "@remix-run/react";
import { Key, Selection } from "~/.server/interfaces";

interface Props {
    falseField: string,
    trueField: string,
    param: string,
    value?: string,
}

export const useDropdownBoolean = ({ value, trueField, falseField, param }: Props) => {
    const [ , setSearchParams] = useSearchParams();
    
    const defaultStatus: Selection = useMemo(() => {

      if(typeof value === 'undefined' || value === 'notUndefined' || value === '') {
        return 'all';
      }
  
      const selectedStatus: Set<Key> = new Set();

      value 
        ? selectedStatus.add(trueField)
        : selectedStatus.add(falseField);
  
      return selectedStatus;
  
    }, [falseField, trueField, value]);
  
    const handleStatusChange = (keys: Selection) => {
      const data = JSON.stringify(Array.from(keys).map(value => value === trueField));
      setSearchParams(prev => {
        prev.set(param,data)
        return prev;
      })
    }

    return  {
        defaultStatus,
        handleStatusChange
    }
}