import { SortDescriptor } from "@nextui-org/react";
import { useNavigation, useSearchParams } from "@remix-run/react";
import { ChangeEvent, useMemo } from "react";
import { LoadingState, SortDirection } from "~/.server/interfaces";

interface Props {
  columnDefault: string,
  pageParam?: string,
  rowParam?: string,
  directionParam?: string,
  columnParam?: string,
}

export const useParamsPaginator = ({ columnDefault, pageParam, rowParam, directionParam, columnParam }: Props) => {

    const navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const loadingState: LoadingState = navigation.state === 'idle' 
    ? 'idle' : 'loading';

    const params =  useMemo(() => {

      return  {
        page: pageParam ?? 'p',
        row: rowParam ?? 'l',
        direction: directionParam ?? 'd',
        column: columnParam ?? 'c'
      }

    }, [pageParam, rowParam, directionParam, columnParam])
    

    const handlePagination = (page: number) => {
        setSearchParams((prev) => {
          prev.set(params.page, String(page))
          return prev;
        });
      }
      
      const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        setSearchParams((prev) => {
          prev.set(params.row, String(e.target.value))
          return prev;
        });
      }
    
      
      const handleSort = (descriptor: SortDescriptor) => {
        const direction = descriptor?.direction ??  'ascending';
        const column = descriptor?.column ??  columnDefault;
        setSearchParams((prev) => {
          prev.set(params.direction, direction);
          prev.set(params.column, String(column));
          return prev;
        }, {preventScrollReset: true});
      }

      const sortDescriptor: SortDescriptor = {
        column: searchParams.get(params.column) || columnDefault,
        direction: searchParams.get(params.direction) as SortDirection || 'ascending'
      }

      return  {
        loadingState,
        handlePagination,
        handleRowPerPage,
        handleSort,
        sortDescriptor
      }
}