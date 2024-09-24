import { json, LoaderFunction } from "@remix-run/node";

import { Generic } from "~/.server/interfaces";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { handlerSuccess, parseBoolean, parseRangeDate } from "~/.server/reponses";
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
  const isActive = url.searchParams.get('isActive') || '';
  const folder = url.searchParams.get('folder') || '';
  const name = url.searchParams.get('name') || '';
  
  const isActiveParsed = parseBoolean(isActive);
  const datesParsed = parseRangeDate(start, end);

  try {
  
      const isActiveFormatted = { column: 'isActive', value: isActiveParsed };
      const curpParsed = { column: 'curp', value: curp };
      const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
      const fullnameParsed = { column: 'fullname', value: name.toLowerCase() };
      const datesFormatted = { column: 'aniversaryDate', value: datesParsed };

    const {
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'fullname', columnsFilter);

    const data = await Service.leader.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'fullname', 
      direction,
      search: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesFormatted]
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
