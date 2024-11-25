import { json, LoaderFunction } from "@remix-run/node";
import { Generic } from "~/.server/interfaces";
import { getEmptyPagination, handlerPaginationParams, handlerSuccess, parseArray, parseBoolean } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { Filter } from "~/.server/domain/interface";

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

export const userLoader: LoaderFunction = async ({ request }) => {

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

    try {
        
        const emailFormatted = { column: 'email', value: email }; 
        const usernameFormatted = { column: 'username', value: username }; 
        const fullNameFormatted = { column: 'fullName', value: fullName }; 
        const isActiveFormatted = { column: 'isActive', value: isActiveParsed }; 
        const sexFormatted = { column: 'sex', value: sexParsed }; 

        const {
            page, limit, column, direction
        } = handlerPaginationParams(request.url, 'username', columnsFilter);

        const data = await Service.user.findAll({
            page, 
            limit,
            column: columnSortNames[column] ?? 'username',
            direction,
            search: [
                emailFormatted,
                usernameFormatted,
                fullNameFormatted,
                isActiveFormatted,
                rolesParsed,
                sexFormatted,
            ]
        });

        return handlerSuccess(200, {
            ...data,
            p: page,
            l: limit,
            c: column,
            d: direction,
            s: [isActiveParsed,rolesParsed],
            email,
            username,
            fullName,
            isActive: isActiveParsed,
            roles: rolesParsed.value,
            sex: sexParsed,
        })

    } catch (error) {
        console.log({error});
        return json(getEmptyPagination({
            email,
            username,
            fullName,
            isActive: isActiveParsed,
            roles: rolesParsed.value,
            sex: sexParsed,
        }))
    }

}
