import { SortDescriptor } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useEffect, useState } from "react";
import { PaginationI } from "~/.server/domain/interface";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";

interface SearchType {
    column: string,
    value: string
}

interface Props {
    key: string,
    route: string,
}

type LoadingState = 'loading' | 'idle';

export const useFetcherPaginator = <T extends Generic>({ key, route }: Props) => {
    const { load, state, data, submit } = useFetcher<HandlerSuccess<PaginationI<T>>>({ key });
    const [ limit, setLimit ] = useState(5);
    const [ page, setPage ] = useState(1);
    const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
      });
      
      const loadingState: LoadingState = (state === 'loading' || state === 'submitting') || !data 
      ? "loading" 
      : "idle";

      useEffect(() => {
        load(`/${route}/?p=${1}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[route]);


    useEffect(() => {
        if(data?.serverData.data.length === 0 && data?.serverData.total > 0){
            load(`/${route}/?l=${limit}&p=${page}&d=${sortDescriptor.direction}&s=${sortDescriptor.column}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handlePagination = (page: number) => {
        setPage(page);
    }

    const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value))
    }

    const onSubmit = (data: SearchType[]) => {
        submit({
            l: limit,
            p: page,
            c: sortDescriptor.column as string,
            d: sortDescriptor.direction as string,
            s: JSON.stringify(data),
        },{ action: `/${route}`} );
    }

    return {
        load, 
        state, 
        data, 
        submit,
        limit, 
        setLimit,
        page, 
        setPage,
        sortDescriptor, 
        setSortDescriptor,
        loadingState,
        handlePagination,
        handleRowPerPage,
        onSubmit
    }

}