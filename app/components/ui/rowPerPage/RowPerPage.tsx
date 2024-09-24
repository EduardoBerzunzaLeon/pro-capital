import { Select, SelectItem } from "@nextui-org/react";
import { useSearchParams } from "@remix-run/react";
import { ChangeEventHandler } from "react";

interface Props {
    checkParams?: boolean;
    onChange?: ChangeEventHandler<HTMLSelectElement>,
}

const options = ['5','10', '20', '50', '100'];

export function RowPerPage({ onChange, checkParams }: Props) {

    const [searchParams] = useSearchParams();
    const defaultValue = (checkParams && searchParams.get('l'))
        ? String(searchParams.get('l'))
        : '5'

    return (
        <label className="flex items-center text-default-400 text-small">
            <Select 
                variant='bordered'
                label="Filas por Página"
                labelPlacement="outside-left"
                className="red-dark text-foreground bg-content1 outline-none text-small pl-4"
                onChange={onChange}
                disallowEmptySelection
                defaultSelectedKeys={[defaultValue]}
            >
                {
                    options.map(option => (
                        <SelectItem key={option}>
                            {option}
                        </SelectItem>
                    ))
                }
            </Select>
        </label>
    )
}

