import {  Select, SelectItem, SelectProps } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Key, SelectionMode, Selection } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";

interface RolData {
    id: number,
    role: string,
}

type Props  = Partial<SelectProps> & {
    defaultSelectedKeys?: "all" | Iterable<Key> | undefined,
    onSelectionChange?: (keys: Selection) => void,
    selectionMode?: SelectionMode,
    className?: string,
}

export const SelectRoles = ({ defaultSelectedKeys, onSelectionChange, selectionMode, className, ...rest }: Props) => {
  
  const { load, data, state } = useFetcher<HandlerSuccess<RolData[]>>({ key: 'getSelectRoles' });
  const [selected, setSelected] = useState<"all" | Iterable<Key>>([]);

  useEffect(() => {
    if(!data?.serverData) {
        load('/roles/select');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[data]);

  // useEffect(() => {

  //   if(defaultSelectedKeys) {
  //       setSelected(defaultSelectedKeys)
  //   }

  // }, [defaultSelectedKeys])

  const handleChange = (keys: Selection) => {
    setSelected(keys);
    !!onSelectionChange && onSelectionChange(keys)
  }

  return (
    <>
    
       <Select
            items={data?.serverData ?? []}
            label="Rol"
            placeholder="Seleccione un rol"
            className={`red-dark text-foreground bg-content1 ${className}`}
            labelPlacement="outside"
            variant="bordered"
            name="role"
            id='role'
            isLoading={state !== 'idle'}
            onSelectionChange={handleChange}
            selectedKeys={selected}
            defaultSelectedKeys={defaultSelectedKeys}
            selectionMode={selectionMode}
            {...rest}
        >
            {
              data?.serverData ? data?.serverData.map((role) => (
                <SelectItem  key={role.id} textValue={role.role.replace('_', ' ')}>
                  <div className="flex items-center justify-between">
                      <span className='text-center'>{role.role.replace('_', ' ')}</span>
                  </div>
                </SelectItem>
              )) : (
                <SelectItem  key={0} textValue='NO ROLE'>
                  <div className="flex items-center justify-between">
                      <span className='text-center'>NO ROLE</span>
                  </div>
                </SelectItem>
              )
            }
        </Select>                
    </>
  )
}
