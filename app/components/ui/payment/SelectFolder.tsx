import { Select, SelectItem } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Selection } from "~/.server/interfaces";

interface Props {
    clientId: number,
    folderId: number,
}

export const SelectFolder = ({ clientId, folderId }: Props) => {

    const fetcher = useFetcher<{ id: number, name: string }[]>({ key: 'getFolder' });
    const [value, setValue] = useState<Selection>(new Set([]));

    useEffect(() => {

        fetcher.submit({
            clientId
        }, {
            method: 'GET',
            action: '/clients/filter/folder'
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[clientId])

    useEffect(() => {
        if(fetcher.data && fetcher.state === 'idle') {
            setValue(new Set([folderId]))
        }
    }, [fetcher.data, fetcher.state])


    console.log(fetcher.data)
  return (
    <Select
        items={fetcher.data ?? []}
        label="Ruta"
        placeholder="Seleccione una carpeta"
        className={`red-dark text-foreground bg-content1`}
        labelPlacement="outside"
        variant="bordered"
        name="route"
        id='route'
        isLoading={fetcher.state !== 'idle'}
        // selectedKeys={value}
        onSelectionChange={setValue}
    >
        {(folder) => <SelectItem  key={folder.id} textValue={`${folder.name}`}>
            <div className="flex items-center justify-between">
                <span className='capitalize'>{folder.name}</span>
            </div>
        </SelectItem>}
    </Select>
  )
}
