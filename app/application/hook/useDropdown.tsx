import { useMemo } from "react";
import { useSearchParams } from "@remix-run/react";
import { Selection } from "~/.server/interfaces";

type Types = 'string';

interface Props {
    param: string,
    type: Types,
    value?: string[],
}

export const useDropdown = ({ value, param, type }: Props) => {
    const [ , setSearchParams] = useSearchParams();
    
    const defaultValue: Selection = useMemo(() => {

        if(!value) {
            return 'all';
          }
    
          if(!Array.isArray(value) ) {
            return 'all'
          }
      
          const areValids =  value.every((element) => typeof element === type);
      
          if(!areValids) {
            return 'all';
          }
      
          return new Set(value);
  
    }, [type, value]);
  
    const handleValueChange = (keys: Selection) => {
        const data = JSON.stringify(Array.from(keys));
        setSearchParams(prev => {
          prev.set(param,data)
          return prev;
        })
    }

    return  {
        defaultValue,
        handleValueChange
    }
}