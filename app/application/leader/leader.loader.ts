import { json, LoaderFunction } from "@remix-run/node";
import dayjs from "dayjs";

import { Generic } from "~/.server/interfaces";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

const columnsFilter = ['curp', 'fullname', 'anniversaryDate', 'isActive', 'folder.name'];
const columnSortNames: Generic = {
  curp: 'curp',
  leader: 'fullname',
  anniversaryDate: 'anniversaryDate',
  isActive: 'isActive',
  folder: 'folder.name'
}

export const leaderLoader: LoaderFunction = async ({ request }) => {
  
  const url = new URL(request.url);
  const start = url.searchParams.get('start') || '';
  const end = url.searchParams.get('end') || '';
  const curp = url.searchParams.get('curp') || '';
  const isActive = url.searchParams.get('isActive');
  const folder = url.searchParams.get('folder') || '';
  const name = url.searchParams.get('name') || '';
  
  let isActiveParsed = isActive
    ? JSON.parse(isActive+'')
    : 'notUndefined';

  if(Array.isArray(isActiveParsed) && isActiveParsed.length === 1) {
    isActiveParsed = Boolean(isActiveParsed[0]);
  }

  if(Array.isArray(isActiveParsed) && isActiveParsed.length === 2) {
    isActiveParsed = 'notUndefined'
  } 

  try {
  
      const isActiveFormatted = { column: 'isActive', value: isActiveParsed };
      const curpParsed = { column: 'curp', value: curp };
      const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
      const fullnameParsed = { column: 'fullname', value: name.toLowerCase() };

      const datesParsed = (!start || !end) 
      ? { column: 'anniversaryDate', value: ''}
      : { column:  'anniversaryDate', value: {
        start: dayjs(start+'T00:00:00.000Z').toDate(),
        end: dayjs(end).toDate()
      }}
    
    const {
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'fullname', columnsFilter);

    const data = await Service.leader.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'fullname', 
      direction,
      search: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesParsed]
    });
    
    return handlerSuccess(200, { 
      ...data,
      p: page,
      l: limit,
      c: column,
      d: direction,
      s: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesParsed],
      isActive: isActiveParsed,
      curp,
      folder,
      fullname: name,
      start,
      end
    });
  } catch (error) {
    console.log({error});
      return json(getEmptyPagination({
        isActive: isActiveParsed,
        curp,
        folder,
        fullname: name,
        start,
        end
      }));
  }
}
