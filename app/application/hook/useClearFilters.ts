import { useSearchParams, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const useClearFilters = (params?: string[]) => {
    const { key: keyLocation, search } = useLocation();
    const [ key, setKey ] = useState('');
    const [ , setSearchParams ] = useSearchParams();

    useEffect(() => {
        setKey(keyLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    useEffect(() => {

        if(keyLocation !== key && !search) {
            setKey(keyLocation)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[keyLocation]);
    
    const onClearFilters = () => {
        if(params && params.length > 0) {
            const urlParams = new URLSearchParams();

            params.forEach(param => {
                urlParams.delete(param, '');
            }) 

            setSearchParams(urlParams);

            return;    
        }
        setSearchParams();
    }

    return {
        key,
        onClearFilters
    }
}