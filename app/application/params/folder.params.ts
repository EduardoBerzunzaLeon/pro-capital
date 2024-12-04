import { Generic } from '~/.server/interfaces';
import { handlerPaginationParams } from '~/.server/reponses';


export const FolderParams = () => {

    const columnSortNames: Generic = {
        town: 'town.name',
        name: 'name',
        municipality: 'town.municipality.name'
    }

    const columnsFilter = ['name', 'town.name', 'town.municipality.name'];
    const defaultColumn =  'name';

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

    return {
        getParams
    }

}