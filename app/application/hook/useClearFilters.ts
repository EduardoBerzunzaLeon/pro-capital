import { useSearchParams, useLocation } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';

export const useClearFilters = (params?: string[], paramsNotDeleted?: string[]) => {
    const { key: keyLocation } = useLocation();
    const [ key, setKey ] = useState(keyLocation);
    const [ clicked, setClicked ] = useState(false);
    const [ searchParams, setSearchParams ] = useSearchParams();

    const paramsCantDeleted =  useMemo(() => {
      return paramsNotDeleted || ['d', 'l', 'p', 'c'];  
    },[paramsNotDeleted])

    const canRenovateKey = () => {
        if(params) {
            const paramsDeleted = params.every((param) => !searchParams.get(param));
            
            if(paramsDeleted) {
                setKey(keyLocation);
            }

            return paramsDeleted;
        }
        
        return keyLocation !== key;
    }
    
    useEffect(() => {

        if(canRenovateKey() && clicked) {
            setKey(keyLocation);
            setClicked(false);
        } 
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[keyLocation]);
    
    const onClearFilters = () => {

        if(params && params.length > 0) {

            setSearchParams((prev) => {
                params.forEach(param => {
                    prev.delete(param);
                }); 
                return prev;
            });

            return;    
        }

        setSearchParams((prev) => {
            const paramsToDeleted: string[] = [];

            prev.forEach((_, key) => {
                if(!paramsCantDeleted.includes(key)) {
                    paramsToDeleted.push(key);
                }
            });

            paramsToDeleted.forEach(param => prev.delete(param));

            return prev;
        });

        setClicked(true);
    }

    return {
        key,
        onClearFilters
    }
}