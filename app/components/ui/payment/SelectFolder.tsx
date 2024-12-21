import { Select, SelectItem } from "@nextui-org/react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

interface Props {
    clientId: number,
    folderId: number,
}

export const SelectFolder = ({ clientId, folderId }: Props) => {

    const fetcher = useFetcher<{ id: number, name: string }[]>({ key: 'getFolders' });
    const fetcherGroup = useFetcher<{ id: number, name: string }[]>({ key: 'getGroups' });
    const [value, setValue] = useState<string | undefined>(undefined);
    const isLoading = fetcher.state !== 'idle' || fetcher.data === undefined;

    const [params] = useSearchParams();


    useEffect(() => {

        fetcher.submit({
            clientId
        }, {
            method: 'GET',
            action: '/clients/filter/folder'
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[clientId])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
        
        fetcherGroup.submit({
            clientId,
            folderId: e.target.value
        }, {
            method: 'GET',
            action: '/clients/filter/group'
        });

    }

  return (
        <Select
            items={fetcher.data ?? []}
            label="Carpeta"
            placeholder="Seleccione una carpeta"
            className={`red-dark text-foreground bg-content1`}
            labelPlacement="outside"
            variant="bordered"
            name="route"
            id='route'
            isLoading={isLoading}
            value={value ? [value.toString()] : []}
            defaultSelectedKeys={[params.get('f')?.toString() ?? folderId.toString()]}
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
  )
}
