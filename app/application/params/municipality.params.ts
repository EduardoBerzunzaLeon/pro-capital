import { handlerPaginationParams } from '~/.server/reponses';


export const MunicipalityParams = () => {

    const defaultColumn = 'name';
    const columnsFilter = ['name'];

    const getParams = (request: Request) => {
        const { 
            page, limit, column, direction, search
          } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);

          return { 
            params: {
                page, 
                limit, 
                column, 
                direction,
                search
            }
          }
    }

    return {
        getParams
    }
}