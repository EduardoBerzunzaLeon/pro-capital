import { handlerPaginationParams } from '~/.server/reponses';


export const RouteParams = () => {


    const defaultColumn = 'name';
    const columnsFilter = ['isActive', 'name'];

    const getParams = (request: Request) => {
        
        const {
            page, limit, column, direction, search
        } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);

        // TODO: Refactor this
        let isActiveParsed = JSON.parse(search[0].value+'');
        
        if(Array.isArray(isActiveParsed) && isActiveParsed.length === 1) {
        isActiveParsed = Boolean(isActiveParsed[0]);
        }
    
        if(Array.isArray(isActiveParsed) && isActiveParsed.length === 2) {
        isActiveParsed = 'notUndefined'
        } 

        search[0].value = isActiveParsed;

        return  {
            params: { page, limit, column, direction, search }
        }
    }

    return {
        getParams
    }
}