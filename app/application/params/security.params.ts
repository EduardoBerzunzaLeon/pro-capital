import { Generic } from '~/.server/interfaces';
import { Filter } from '~/.server/domain/interface';
import { handlerPaginationParams } from '~/.server/reponses';


export const SecurityParams = () => {

    const defaultColumn = 'role';
    const columnsFilter = ['role'];
    const columnSortNames: Generic = { role: 'role'};

    const convertRoutes = (routes: string) =>  {
    return routes.split(',').map(r => parseInt(r));
    }

    const getParams = (request: Request) => {

        const url = new URL(request.url);
        const roles = url.searchParams.get('roles') || '';
        const rolesParsed: Filter  = (roles && roles !== 'all') 
        ? { column: 'id', value: convertRoutes(roles)}
        : { column: 'id', value: '' };

        const {
            page, limit, column, direction
          } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);


        return {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? defaultColumn, 
                direction,
                search: [rolesParsed],
            },
            search: {
                roles: rolesParsed.value,
            }
        };
    }

    return {
        getParams
    }

}