import { json, LoaderFunction } from "@remix-run/node";
import { Generic } from "~/.server/interfaces";
import { getEmptyPagination, handlerPaginationParams, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

const columnsFilter = [ 'client.fullname','folder.name'];

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

export const payLoader: LoaderFunction  = async ({ request }) => {

    const url = new URL(request.url);
    const client = url.searchParams.get('client') || '';
    const folder = url.searchParams.get('folder') || '';

    try {
        
        const folderParsed = { column: 'folder.name', value: folder };
        const fullnameParsed = { column: 'client.fullname', value: client };
        const statusFormatted = { column: 'status', value: ['ACTIVO', 'VENCIDO', 'RENOVADO'] };

        const {
            page, limit, column, direction
        } = handlerPaginationParams(request.url, 'captureAt', columnsFilter);

        const data = await Service.credit.findAll({
            page, 
            limit, 
            column: columnSortNames[column] ?? 'captureAt', 
            direction,
            search: [
              folderParsed, 
              fullnameParsed,
              statusFormatted 
           ]
          });

          return handlerSuccess(200, {
                ...data,
                p: page,
                l: limit,
                c: column,
                d: direction,
                s: [folderParsed, fullnameParsed],
                client,
                folder
           });
           
    } catch (error) {
        return json(getEmptyPagination({ client, folder }));
    }
    
}