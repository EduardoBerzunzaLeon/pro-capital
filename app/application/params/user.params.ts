import { Generic } from '~/.server/interfaces';
import { Filter } from '~/.server/domain/interface';
import { parseBoolean, parseArray, handlerPaginationParams } from '~/.server/reponses';


export const UserParams = () => {

    const defaultColumn = 'username';

    
    const columnsFilter = [
        'email', 'username', 'fullName', 'isActive', 'roleId','sex'
    ];

    const columnSortNames: Generic = {
        email: 'email',
        username: 'username',
        fullName: 'fullName',
        isActive: 'isActive',
        role: 'role.role',
        sex: 'sex'
    }
    
    const convertRoutes = (routes: string) =>  {
        return routes.split(',').map(r => parseInt(r));
    }

    const getParams = (request: Request) => {
        const url = new URL(request.url);
        const email = url.searchParams.get('email') || '';
        const username = url.searchParams.get('username') || '';
        const fullName = url.searchParams.get('fullName') || '';
        const isActive = url.searchParams.get('isActive') || '';
        const roles = url.searchParams.get('roles') || '';
        const sex = url.searchParams.get('sex') || '';

        const isActiveParsed = parseBoolean(isActive);
        const sexParsed =  parseArray(sex);

        const rolesParsed: Filter  = (roles && roles !== 'all') 
        ? { column: 'role.id', value: convertRoutes(roles)}
        : { column: 'role.id', value: '' };


        const emailFormatted = { column: 'email', value: email }; 
        const usernameFormatted = { column: 'username', value: username }; 
        const fullNameFormatted = { column: 'fullName', value: fullName }; 
        const isActiveFormatted = { column: 'isActive', value: isActiveParsed }; 
        const sexFormatted = { column: 'sex', value: sexParsed }; 

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
                    emailFormatted,
                    usernameFormatted,
                    fullNameFormatted,
                    isActiveFormatted,
                    rolesParsed,
                    sexFormatted,
                ]
            },
            search: {
                s: [isActiveParsed,rolesParsed],
                email,
                username,
                fullName,
                isActive: isActiveParsed,
                roles: rolesParsed.value,
                sex: sexParsed,
            }
        }
    }

    return {
        getParams
    }
}
