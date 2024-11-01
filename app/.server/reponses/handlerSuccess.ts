import { json } from "@remix-run/node";
import { HandlerSuccess } from "./handler.interface";
import { jsonWithSuccess } from "remix-toast";

type TypeHandler = 'update' | 'delete' | 'create';

export const handlerSuccess = <T>(status: number, data: T)  => {
    return json<HandlerSuccess<T>>({
        status: 'success',
        serverData: data,
        error: null
    }, status)
}

export const handlerSuccessWithToast = (type: TypeHandler, info?: string) => {

    const infoSanatized = info ? ` ${info}` : '';

    const types = {
        update: {
            result: 'Data saved successfully',
            message: `¡Actualización exitosa${infoSanatized}! 🎉`,
        },
        delete: {
            result: 'Data deleted successfully',
            message: `¡Elimación exitosa${infoSanatized}! 🎉`,
        },
        create: {
            result: 'Data created successfully',
            message: `¡Creación exitosa${infoSanatized}! 🎉`,
        }
    }

    const defaultType = { result: 'Operation done successfully', message: '¡Operación realizada con exito! 🎉'};

    const { result, message  } = types[type] ?? defaultType;

    return jsonWithSuccess({ result, status: 'success' }, message);

}

export const handlerPaginationParams = (urlText: string, defaultColumn: string, columns: string[]) => {
    const url = new URL(urlText);

    const page = url.searchParams.get('p') || 1;
    const limit = url.searchParams.get('l') || 5;
    const column = url.searchParams.get('c') || defaultColumn;
    const direction = url.searchParams.get('d') || 'ascending';
    const searchData = url.searchParams.get('s');
    
    const searchParsed = searchData 
    ? convertSearchData(searchData, defaultColumn) 
    : convertColumns(columns);
    
    return {
        page: Number(page),
        limit: Number(limit),
        column,
        direction,
        search: searchParsed
    }

}

const convertColumns = (columns: string[]) => {
    return columns.map((column) => ({ column, value: '' }));
}

interface Search {
    column: string,
    value: string,
    type?: string
}
const convertSearchData = (searchData: string, defaultColumn: string) => {
    const parsed: Search[] = JSON.parse(searchData);

    if(parsed.length === 0) {
        return [{ column: defaultColumn, value: '' }];
    }

    if(!parsed[0]['column'] || !parsed[0]['value']) {
        return [{ column: defaultColumn, value: '' }];
    }

    return parsed.map(({ column, value, type }) => {

        if(!type)  return { column, value };

        if(type === 'number' && !isNaN(Number(value))) {
            return { column, value: Number(value)}
        }
        
        if(type === 'boolean') {
            return { column, value: value === 'true'}
        }

        return { column, value };
    })

}

export const handlerAutocomplete = async <T>(urlText: string, serviceCB: (arg: string) => Promise<T>
) => {
    try {

        const url = new URL(urlText);
        const data = url.searchParams.get('data') || ''; 
    
        if(data.length === 0){
            return [];
        }
    
        const dataDB = await serviceCB(data.toLowerCase());
        return handlerSuccess(200, dataDB);

    } catch (error) {
        console.log({error});
        return handlerSuccess(200, []);
    }
    
}