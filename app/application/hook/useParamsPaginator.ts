import { SortDescriptor } from "@nextui-org/react";
import { useNavigation, useSearchParams } from "@remix-run/react";
import { ChangeEvent } from "react";
import { LoadingState, SortDirection } from "~/.server/interfaces";

interface Props {
  columnDefault: string,
}

export const useParamsPaginator = ({ columnDefault }: Props) => {

    const navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const loadingState: LoadingState = navigation.state === 'idle' 
    ? 'idle' : 'loading';
    

    const handlePagination = (page: number) => {
        setSearchParams((prev) => {
          prev.set('p', String(page))
          return prev;
        });
      }
      
      const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        setSearchParams((prev) => {
          prev.set('l', String(e.target.value))
          return prev;
        });
      }
    
      
      const handleSort = (descriptor: SortDescriptor) => {
        const direction = descriptor?.direction ??  'ascending';
        const column = descriptor?.column ??  columnDefault;
        setSearchParams((prev) => {
          prev.set("d", direction);
          prev.set("c", String(column));
          return prev;
        }, {preventScrollReset: true});
      }

      const sortDescriptor: SortDescriptor = {
        column: searchParams.get('c') || columnDefault,
        direction: searchParams.get('d') as SortDirection || 'ascending'
      }

      return  {
        loadingState,
        handlePagination,
        handleRowPerPage,
        handleSort,
        sortDescriptor
      }
}