import { Select, SelectItem } from "@nextui-org/react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

interface Props {
    clientId: number,
    folderId: number,
    groupId: number,
}

export const SelectGroup = ({ clientId, folderId, groupId }: Props) => {

    const fetcher = useFetcher<{ serverData: {id: number, name: string }[], folderId: number }>({ key: 'getGroups' });
    const [value, setValue] = useState<string | undefined>(undefined);
    const isLoading = fetcher.state !== 'idle' || fetcher.data === undefined;
    const [params , setSearchParams] = useSearchParams();

    useEffect(() => {

        if(fetcher.state === 'idle' && fetcher.data) {
            const newValue = fetcher.data?.serverData.length > 0 
                ? fetcher.data?.serverData[0].id.toString()
                : undefined;
            setValue(newValue);
        } 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.state, fetcher.data])
    console.log({ data: fetcher.data, value });

    useEffect(() => { 
        // NOTE: Avoid rerender in the first call
        if(value === groupId.toString() && params.size === 0) return;

        if(value) {
            setSearchParams(prev => {
                prev.set('g', value ?? '')
                prev.set('cl', clientId.toString())
                prev.set('f', fetcher.data?.folderId.toString() ?? prev.get('f')?.toString() ?? '')
                return prev;
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {

        fetcher.submit({
            clientId,
            folderId: params.get('f')?.toString() ?? folderId
        }, {
            method: 'GET',
            action: '/clients/filter/group'
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[clientId])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
    }

  return (
        <Select
            items={fetcher.data?.serverData ?? []}
            label="Ruta"
            placeholder="Seleccione una carpeta"
            className={`red-dark text-foreground bg-content1`}
            labelPlacement="outside"
            variant="bordered"
            name="route"
            id='route'
            isLoading={isLoading}
            value={ value ? [value.toString()] : [] }
            selectedKeys={value ? [value.toString()] : []}
            defaultSelectedKeys={[params.get('g')?.toString() ?? groupId.toString()]}
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
