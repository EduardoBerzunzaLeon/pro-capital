import { useSearchParams } from "@remix-run/react";
import {  useMemo } from "react";
import { Key, Selection } from "~/.server/interfaces";

interface Props<T> {
    items?: T[],
    param: string,
    mapper: (item: T) => Key
}


export const useParamsSelect = <T>({ items, param, mapper }: Props<T>) => { 

    const [ , setSearchParams ] = useSearchParams();

    const defaultItems = useMemo(() => {
        return items && items.map(mapper);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[items]);

    const returnItem = (selection: Selection) => {
        if( typeof selection === 'string' 
            || selection.size === 0 ) {
            return 'all';
        }
        return [...selection].join(',');
    }

    const handleSelection = (selection: Selection) => {
        const item = returnItem(selection);
        setSearchParams((prev) => {
            prev.set(param, item)
            return prev;
        });
    }

    return  {
        defaultItems,
        handleSelection,
        returnItem,
    }

}
