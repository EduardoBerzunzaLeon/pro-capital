import { Input, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, Key, useCallback, useEffect, useState } from "react";
import { TownI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { HandlerSuccess } from "~/.server/reponses";
import { Pagination, RowPerPage } from "..";
import { FaSearch } from "react-icons/fa";
import { FolderI } from "~/.server/domain/entity/folder.entity";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE',  sortable: true },
  { key: 'leader', label: 'LIDER', },
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'town', label: 'Localidad',  sortable: true },
  { key: 'count', label: 'Grupos',  },
  { key: 'actions', label: 'ACTIONS'},
]

export function FolderSection() {
    const { load, state, data, submit } = useFetcher<HandlerSuccess<PaginationI<FolderI>>>({ key: 'folder' });

    const [ limit, setLimit ] = useState(5);
    const [ page, setPage ] = useState(1);
    const [ search, setSearch ] = useState('');
    const [ searchMunicipality, setSearchMunicipality ] = useState('');
    const [ searchTown, setSearchTown ] = useState('');
    const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
      });
      
      const loadingState = state === 'loading' || !data 
      ? "loading" 
      : "idle";


    console.log({dataFolder: data});
      useEffect(() => {
        load(`/folder/?pm=${1}`);
    },[load]);

    
    useEffect(() => {
      if(data?.serverData.data.length === 0 && data?.serverData.total > 0){
          load(`/town/?limit=${limit}&page=${page}&dm=${sortDescriptor.direction}`);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
      // load(`/town/?lm=${limit}&pm=${page}&cm=${sortDescriptor.column}&dm=${sortDescriptor.direction}&sm=${search}`)
      const data = [
          { column: 'name', value: search },
          { column: 'municipality', value: searchMunicipality }
      ];

      submit({
          lm: limit,
          pm: page,
          cm: sortDescriptor.column as string,
          dm: sortDescriptor.direction as string,
          sm: JSON.stringify(data),
      },{ action: '/town'} );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, sortDescriptor, search, searchMunicipality]);
  
  const handlePagination = (page: number) => {
    setPage(page);
}

const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value))
}

const handlerClose = () => {
    setSearch('');
}

const handlerCloseMunicipality = () => {
    setSearchMunicipality('');
}

const renderCell = useCallback((town: TownI, columnKey: Key) => {
  if(columnKey === 'actions') {
  //   return (<MunicipalityAction onOpenEdit={onOpen} idMunicipality={municipality.id}/>)
      return <span>ACTIONS</span>
  } 

  return <span className="capitalize">{town[(columnKey as any)]}</span>;
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
    return (
        <div>folderSection</div>
    )
}