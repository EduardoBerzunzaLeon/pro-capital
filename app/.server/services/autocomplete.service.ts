import { Generic } from "../interfaces";

export const mapper = (idColumn: string, valueColumn: string, data?: Generic[])  => {
    if(!data || data?.length === 0) return [];
    return data.map(obj  => {
        return  {
            id: obj[idColumn],
            value: obj[valueColumn]
        }
    })
}

export default {
    mapper
}