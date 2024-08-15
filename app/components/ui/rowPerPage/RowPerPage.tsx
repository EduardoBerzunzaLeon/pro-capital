import { ChangeEventHandler } from "react";

interface Props {
    onChange?: ChangeEventHandler<HTMLSelectElement>
}

export function RowPerPage({ onChange }: Props) {
    return (
        <label className="flex items-center text-default-400 text-small">
            Filas por Página
            <select
                className="red-dark text-foreground bg-content1 outline-none text-small"
                onChange={onChange}
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </label>
    )
}

