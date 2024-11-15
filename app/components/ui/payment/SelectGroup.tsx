import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

interface Props {
    clientId: number,
    folderId: number,
    groupId: number,
}

export const SelectGroup = ({ clientId, folderId, groupId }: Props) => {

    const fetcher = useFetcher<{ id: number, name: string }[]>({ key: 'getGroups' });
    const [value, setValue] = useState(groupId.toString());
    const isLoading = fetcher.state !== 'idle' || fetcher.data === undefined;
    const [ , setSearchParams] = useSearchParams();

    console.log({fetcher: fetcher})
    useEffect(() => {

        fetcher.submit({
            clientId,
            folderId
        }, {
            method: 'GET',
            action: '/clients/filter/group'
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[clientId])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
        setSearchParams(prev => {
            prev.set('group', e.target.value)
            return prev;
        })
    }

    // TODO: DELETE DEFAULTsELECTED AND 
  return (
    <Skeleton isLoaded={!isLoading} className="w-3/5">
        <Select
            items={fetcher.data ?? []}
            label="Ruta"
            placeholder="Seleccione una carpeta"
            className={`red-dark text-foreground bg-content1`}
            labelPlacement="outside"
            variant="bordered"
            name="route"
            id='route'
            isLoading={isLoading}
            value={[value.toString()]}
            defaultSelectedKeys={[groupId.toString()]}
            onChange={handleChange}
            disallowEmptySelection
        >
            {(folder) => (
                <SelectItem  key={folder.id} textValue={`${folder.name}`}>
                    <div className="flex items-center justify-between">
                        <span className='capitalize'>{folder.name}</span>
                    </div>
                </SelectItem>
            )}
        </Select>
        </Skeleton>
  )
}
