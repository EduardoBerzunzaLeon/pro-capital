import { Generic } from "~/.server/interfaces";
import { handlerPaginationParams } from "~/.server/reponses";


export const PermissionParams = () => {

    const columnsFilter = ['name', 'description', 'module.name'];
    const columnSortNames: Generic ={ role: 'role', module: 'module.name' };
    const defaultColumn = 'name';

    const getParams = (request: Request) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name') || '';
        const description = url.searchParams.get('description') || '';
        const moduleName = url.searchParams.get('module') || '';
    
        const nameFormatted = { column: 'name', value: name }; 
        const descriptionFormatted = { column: 'description', value: description }; 
        const moduleFormatted = { column: 'module.name', value: moduleName }; 

        const {
            page, limit, column, direction
          } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);

        return {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? defaultColumn, 
                direction,
                search: [
                  nameFormatted,
                  descriptionFormatted,
                  moduleFormatted,
                ],
            },
            search: {
                name,
                description,
                module: moduleName 
            },
        }  

    }

    return {
        getParams
    }

}