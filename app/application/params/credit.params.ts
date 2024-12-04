import { Generic } from '~/.server/interfaces';
import { parseBoolean, parseArray, parseRangeDate, parseRangeInt, parseNumber, handlerPaginationParams } from '~/.server/reponses';



export const CreditParams = () => {
    const defaultColumn = 'assignAt';

    const columnsFilter = [
        'client.fullname', 'aval.fullname', 'captureAt', 'creditAt', 'folder.name',
        'group.name', 'folder.town.name', 'status', 'currentDebt', 'folder.town.municipality.name'
      ];
      
    const columnSortNames: Generic = {
        curp: 'client.curp',
        client: 'client.fullname',
        aval: 'aval.fullname',
        captureAt: 'captureAt',
        creditAt: 'creditAt',
        status: 'status',
        folder: 'folder.name',
        town: 'folder.town.name',
        municipality: 'folder.town.municipality.name',
        nextPayment: 'nextPayment',
        lastPayment: 'lastPayment',
        currentDebt: 'currentDebt'
    }


    const getParams = (request: Request) => {
        const url = new URL(request.url);
  
        const curp = url.searchParams.get('curp') || '';
        const aval = url.searchParams.get('aval') || '';
        const client = url.searchParams.get('client') || '';
        const folder = url.searchParams.get('folder') || '';
        const creditStart = url.searchParams.get('creditStart') || '';
        const creditEnd = url.searchParams.get('creditEnd') || '';
        const captureStart = url.searchParams.get('captureStart') || '';
        const captureEnd = url.searchParams.get('captureEnd') || '';
        const status = url.searchParams.get('status') || '';
        const canRenovate = url.searchParams.get('canRenovate') || '';
        const debt = url.searchParams.get('debt') || '';
        const municipality = url.searchParams.get('municipality') || '';
        const town = url.searchParams.get('town') || '';
        const group = url.searchParams.get('group') || '';

        const canRenovateParsed = parseBoolean(canRenovate);
        const statusParsed =  parseArray(status);
        const creditAtParsed = parseRangeDate(creditStart, creditEnd)
        const captureAtParsed = parseRangeDate(captureStart, captureEnd);
        const debtParsed = parseRangeInt(debt);
        const groupParsed = parseNumber(group);

        const curpParsed = { column: 'client.curp', value: curp };
        const folderParsed = { column: 'folder.name', value: folder };
        const fullnameParsed = { column: 'client.fullname', value: client };
        const fullnameAvalParsed = { column: 'aval.fullname', value: aval };
        const statusFormatted = { column: 'status', value: statusParsed };
        const canRenovateFormatted = { column: 'canRenovate', value: canRenovateParsed };
        const creditAtFormatted = { column: ' creditAt', value:  creditAtParsed };
        const captureAtFormatted = { column: 'captureAt', value: captureAtParsed };
        const debtFormatted = { column: 'currentDebt', value: debtParsed };
        const municipalityFormatted = { column: 'folder.town.municipality.name', value: municipality };
        const townFormatted = { column: 'folder.town.name', value: town };
        const groupFormatted  = { column: 'group.name', value: groupParsed };
        
        const {
          page, limit, column, direction
        } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);


        return {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? 'captureAt', 
                direction,
                search: [
                  curpParsed, 
                  folderParsed, 
                  fullnameParsed, 
                  statusFormatted, 
                  canRenovateFormatted,
                  debtFormatted,
                  captureAtFormatted,
                  creditAtFormatted,
                  fullnameAvalParsed,
                  municipalityFormatted,
                  townFormatted,
                  groupFormatted,
               ]
            },
            search: {
                curp,
                folder,
                aval: 
                client,
                municipality,
                status: statusParsed,
                canRenovate: canRenovateParsed,
                town,
                creditStart,
                creditEnd,
                captureStart,
                debt: debtParsed,
                captureEnd,
                group
            }
        }
    }

    return {
        getParams
    }
}