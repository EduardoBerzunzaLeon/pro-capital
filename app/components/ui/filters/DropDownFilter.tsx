import { useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { Key, Selection } from "~/.server/interfaces";

interface Props {
    param: string,
    searchQuery: unknown
}

export const DropdownFilter = ({ param, searchQuery }: Props) => {

    const [ , setSearchParams] = useSearchParams();

    const defaultValue: Selection = useMemo(() => {
    
        if(searchQuery === undefined || searchQuery === 'all') {
          return new Set(['active','inactive']);
        }
    
        const selectedStatus: Set<Key> = new Set();
    
    
        isActive 
          ? selectedStatus.add('active')
          : selectedStatus.add('inactive');
    
        return selectedStatus;
    
    }, [searchQuery]);

}