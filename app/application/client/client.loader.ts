
import { json, LoaderFunction } from '@remix-run/node';
import dayjs from 'dayjs';
import { Generic } from '~/.server/interfaces';
import { handlerSuccess } from '~/.server/reponses';
import { getEmptyPagination } from '~/.server/reponses/handlerError';
import { handlerPaginationParams } from '~/.server/reponses/handlerSuccess';
import { Service } from '~/.server/services';

const columnsFilter = [
    'client.fullname', 'aval.fullname', 'captureAt', 'creditAt', 'folder.name',
    'group.name.fullname', 'folder.town.name', 'status', 'currentDebt', 'folder.town.municipality.name'
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
  
  export const clientLoader: LoaderFunction = async ({ request }) => {
    
    const url = new URL(request.url);
  
    const curp = url.searchParams.get('curp') || '';
    const aval = url.searchParams.get('aval') || '';
    const client = url.searchParams.get('client') || '';
    const folder = url.searchParams.get('folder') || '';
    const municipality = url.searchParams.get('municipality') || '';
    const town = url.searchParams.get('town') || '';
    const group = url.searchParams.get('group') || '';
    const creditStart = url.searchParams.get('creditStart') || '';
    const creditEnd = url.searchParams.get('creditEnd') || '';
    const captureStart = url.searchParams.get('captureStart') || '';
    const captureEnd = url.searchParams.get('captureEnd') || '';
    const status = url.searchParams.get('status') || '';
    const canRenovate = url.searchParams.get('canRenovate') || '';
    const debt = url.searchParams.get('debt') || '';
  
    const debtParsed = debt
      ? JSON.parse(debt)
      : '';
  
    const debtFormatted: { column: string, value: unknown} = {
      column: 'currentDebt',
      value: ''
    };
  
    if(Array.isArray(debtParsed) && debtParsed.length === 2) {
      debtFormatted.value = {
          start: Number(debtParsed[0]),
          end: Number(debtParsed[1])
      }
    }
     
    let statusParsed = status
      ? JSON.parse(status)
      : 'notUndefined';
  
    if(!Array.isArray(statusParsed)) {
      statusParsed = 'notUndefined';
    }
    
    let canRenovateParsed = canRenovate
      ? JSON.parse(canRenovate+'')
      : 'notUndefined';
  
    if(Array.isArray(canRenovateParsed) && canRenovateParsed.length === 1) {
      canRenovateParsed = Boolean(canRenovateParsed[0]);
    }
  
    if(Array.isArray(canRenovateParsed) && canRenovateParsed.length === 2) {
      canRenovateParsed = 'notUndefined'
    } 
  
    try {
    
        const curpParsed = { column: 'curp', value: curp };
        const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
        const fullnameParsed = { column: 'client.fullname', value: client.toLowerCase() };
        const statusFormatted = { column: 'status', value: statusParsed };
        const canRenovateFormatted = { column: 'canRenovate', value: canRenovateParsed };
  
        const creditAtParsed = (!creditStart || !creditEnd) 
        ? { column: 'creditAt', value: ''}
        : { column:  'creditAt', value: {
          start: dayjs(creditStart+'T00:00:00.000Z').toDate(),
          end: dayjs(creditEnd).toDate()
        }}
        
        
        const captureAtParsed = (!captureStart || !captureEnd) 
        ? { column: 'captureAt', value: ''}
        : { column:  'captureAt', value: {
          start: dayjs(captureStart+'T00:00:00.000Z').toDate(),
          end: dayjs(captureEnd).toDate()
        }}
      
      const {
        page, limit, column, direction
      } = handlerPaginationParams(request.url, 'captureAt', columnsFilter);
  
      const data = await Service.credit.findAll({
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
          captureAtParsed,
          creditAtParsed,
       ]
      });
      
      return handlerSuccess(200, { 
        ...data,
        p: page,
        l: limit,
        c: column,
        d: direction,
        s: [curpParsed, folderParsed, fullnameParsed],
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
      });
    } catch (error) {
      console.log({error});
        return json(getEmptyPagination({
          client,
          aval,
          curp,
          municipality,
          town,
          group,
          creditStart,
          creditEnd,
          canRenovate: canRenovateParsed,
          status: statusParsed,
          captureStart,
          debt: debtParsed,
          captureEnd,
        }));
    }
  }