import { Generic } from '~/.server/interfaces';
import { parseBoolean, parseRangeDate, handlerPaginationParams } from '~/.server/reponses';


export const LeaderParams = () => {


    const defaultColumn = 'fullname';

    const columnsFilter = ['curp', 'fullname', 'anniversaryDate', 'isActive', 'folder.name'];

    const columnSortNames: Generic = {
      curp: 'curp',
      leader: 'fullname',
      anniversaryDate: 'anniversaryDate',
      isActive: 'isActive',
      folder: 'folder.name'
    }

    const getParams = (request: Request) => {
        const url = new URL(request.url);
        const start = url.searchParams.get('start') || '';
        const end = url.searchParams.get('end') || '';
        const curp = url.searchParams.get('curp') || '';
        const isActive = url.searchParams.get('isActive') || '';
        const folder = url.searchParams.get('folder') || '';
        const name = url.searchParams.get('name') || '';
        
        const isActiveParsed = parseBoolean(isActive);
        const datesParsed = parseRangeDate(start, end);
    
        const isActiveFormatted = { column: 'isActive', value: isActiveParsed };
        const curpParsed = { column: 'curp', value: curp };
        const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
        const fullnameParsed = { column: 'fullname', value: name.toLowerCase() };
        const datesFormatted = { column: 'aniversaryDate', value: datesParsed };
    
        const {
            page, limit, column, direction
        } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);
    
    
        return {
            params:  {
                page, 
                limit, 
                column: columnSortNames[column] ?? defaultColumn, 
                direction,
                search: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesFormatted]
            },
            search: {
                isActive: isActiveParsed,
                curp,
                folder,
                fullname: name,
                start,
                end,
                s: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesParsed],
            }
        }
    }

    return { 
        getParams
    }

}