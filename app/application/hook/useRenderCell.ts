
import { useCallback } from "react"
import { Generic, Key } from "~/.server/interfaces"

interface Props {
    isMoney?: boolean
}

export const useRenderCell = ({ isMoney }: Props) => {

    const render = useCallback(<T extends Generic>(row: T, columnKey: Key) => {
        const result = convert(String(columnKey), row);
        if(result && !isNaN(Number(result)) && isMoney) {
            return `$${result}`;
        }

        if(typeof result  === 'string') {
            return result.replace('_', ' ');
        }
        
        return result;
    }, [isMoney]);

    const convert = <T extends Generic>(columnKey: keyof T, row: T) => {

        let nestedObj = row;
        let result = 'no definido';

        const columns = String(columnKey).split('.');

        columns.forEach((name, index) => {
            if (index !== columns.length - 1) {
                nestedObj = nestedObj[name as keyof T];
                return;
            }

            if(name in nestedObj) {
                result = nestedObj[name];
                return;
            }
        });

        return result;
    }

    return {
        render
    }



}
