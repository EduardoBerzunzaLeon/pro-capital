import {  Select, SelectItem, SelectProps } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { Selection } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";

interface RolData {
    id: number,
    role: string,
}

type Props  = Partial<SelectProps> & {
    onSelectionChange?: (keys: Selection) => void,
    className?: string,
}

export const SelectRoles = ({ className, ...rest }: Props) => {
  
  const { load, data, state } = useFetcher<HandlerSuccess<RolData[]>>({ key: 'getSelectRoles' });
  const isLoading = state !== 'idle' || data === undefined;

  useEffect(() => {
    if(!data?.serverData) {
        load('/roles/select');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[data]);

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
            isLoading={isLoading}
            {...rest}
        >
              {(role) => (
                <SelectItem  key={role.id} textValue={role.role.replace('_', ' ')}>
                  <div className="flex items-center justify-between">
                      <span className='text-center'>{role.role.replace('_', ' ')}</span>
                  </div>
              </SelectItem>
            )}
        </Select>                
    </>
  )
}
