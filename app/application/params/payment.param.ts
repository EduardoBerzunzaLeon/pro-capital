import { Generic } from '~/.server/interfaces';
import { handlerPaginationParams } from '~/.server/reponses';




export const PaymentParams = () => {

    const defaultColumn = 'captureAt';

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

    const getParams = (request: Request) => {
        
        const url = new URL(request.url);
        const client = url.searchParams.get('client') || '';
        const folder = url.searchParams.get('folder') || '';   
        const folderParsed = { column: 'folder.name', value: folder };
        const fullnameParsed = { column: 'client.fullname', value: client };
        const statusFormatted = { column: 'status', value: ['ACTIVO', 'VENCIDO', 'RENOVADO'] };

        const {
            page, limit, column, direction
        } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);

        return  {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? 'captureAt', 
                direction,
                search: [
                    folderParsed, 
                    fullnameParsed,
                    statusFormatted 
                ]
            },
            search: {
                client,
                folder
            }
        }
    }

    return {
        getParams
    }
}