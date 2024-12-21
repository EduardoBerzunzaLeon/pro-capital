import { Chip, Select, SelectItem } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Key, SelectionMode, Selection } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";

interface RouteData {
    id: number,
    name: number,
    isActive: boolean,
}

interface Props {
    defaultSelectedKeys?: "all" | Iterable<Key> | undefined,
    onSelectionChange?: (keys: Selection) => void,
    selectionMode?: SelectionMode,
    className?: string,
    isRequired?: boolean,
}

export const SelectRoutes = ({ 
  defaultSelectedKeys, 
  onSelectionChange, 
  selectionMode, 
  className,
  isRequired 
}: Props) => {
  
  const { load, data, state } = useFetcher<HandlerSuccess<RouteData[]>>({ key: 'getSelectRoutes' });
  const [selected, setSelected] = useState<"all" | Iterable<Key>>([]);

  useEffect(() => {
    if(!data?.serverData) {
        load('/routePage/select');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[data]);

  useEffect(() => {

    if(defaultSelectedKeys) {
        setSelected(defaultSelectedKeys)
    }

  }, [defaultSelectedKeys])

  const handleChange = (keys: Selection) => {
    setSelected(keys);
    !!onSelectionChange && onSelectionChange(keys)
  }

  return (
    <>
    
       <Select
            items={data?.serverData ?? []}
            label="Ruta"
            placeholder="Seleccione una ruta"
            className={`red-dark text-foreground bg-content1 ${className}`}
            labelPlacement="outside"
            variant="bordered"
            name="route"
            id='route'
            isLoading={state !== 'idle'}
            onSelectionChange={handleChange}
            selectedKeys={selected}
            selectionMode={selectionMode}
            isRequired={isRequired}
        >
            {(route) => <SelectItem  key={route.id} textValue={`Ruta ${route.name}`}>
                <div className="flex items-center justify-between">
                    <span className='text-center'>{`Ruta ${route.name}`}</span>
                    { !route.isActive 
                        && (<Chip color="danger" variant="bordered">Inactiva</Chip>)
                    }
                </div>
            </SelectItem>}
        </Select>                
    </>
  )
}
