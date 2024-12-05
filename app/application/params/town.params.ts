import { Generic } from '~/.server/interfaces';
import { handlerPaginationParams } from '~/.server/reponses';


export const TownParams = ( ) => {

    const defaultColumn = 'name';
    const columnSortNames: Generic = {
        name: 'name',
        municipality: 'municipality.name'
      }
      
    const columnsFilter = ['name', 'municipality.name'];

    const getParams = (request: Request) => {
        const { 
            page, limit, column, direction, search
          } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);


         return {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? defaultColumn, 
                direction,
                search
            }
         } 
    }

    return  {
        getParams
    }
}