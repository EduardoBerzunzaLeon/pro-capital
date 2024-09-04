import { Chip, Select, SelectItem } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { HandlerSuccess } from "~/.server/reponses";
import { Key } from "../folder/FolderSection";

interface RouteData {
    id: number,
    name: number,
    isActive: boolean
}

interface Props {
    defaultSelectedKeys?: "all" | Iterable<Key> | undefined
}

export const SelectRoutes = ({ defaultSelectedKeys }: Props) => {
  const { load, data, state } = useFetcher<HandlerSuccess<RouteData[]>>({ key: 'getSelectRoutes' });

  useEffect(() => {
    if(!data?.serverData) {
        load('/routePage/select');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[data]);

  return (
       <Select
            items={data?.serverData ?? []}
            label="Ruta"
            placeholder="Seleccione una ruta"
            className="red-dark text-foreground bg-content1"
            labelPlacement="outside"
            variant="bordered"
            name="route"
            isLoading={state !== 'idle'}
            defaultSelectedKeys={data?.serverData ? defaultSelectedKeys : undefined}
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
  )
}
