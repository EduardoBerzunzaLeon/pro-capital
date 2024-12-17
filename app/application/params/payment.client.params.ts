import { Generic } from '~/.server/interfaces';
import { parseNumber, handlerPaginationParams } from '~/.server/reponses';

export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};

export const PaymentClientParams = () => {

    const defaultColumn = 'captureAt';

    const columnsFilter = [
        'credit.client.fullname', 'credit.aval.fullname', 'credit.folder.name',
        'credit.group.name', 'credit.folder.town.name', 'status', 'credit.currentDebt', 
        'credit.folder.town.municipality.name', 'agent.fullName', 'folio', 'paymentDate', 'captureAt', 'paymentAmount'
      ];
    
      const columnSortNames: Generic = {
        curp: 'credit.client.curp',
        client: 'credit.client.fullname',
        aval: 'credit.aval.fullname',
        captureAt: 'captureAt',
        status: 'status',
        folder: 'folder.name',
        town: 'folder.town.name',
        municipality: 'folder.town.municipality.name',
        currentDebt: 'currentDebt',
        paymentAmount: 'paymentAmount',
        paymentDate: 'paymentDate',
        folio: 'folio',
        agent: 'agent.fullName'
      }

      const getParams = (request: Request, params: Params ) => {
        const url = new URL(request.url);
        const group = url.searchParams.get('g') || '';
        const folder = url.searchParams.get('f') || '';
        const client = url.searchParams.get('cl') || '';
        const { creditId } = params;
        
        const groupParsed = parseNumber(group);
        const clientParsed = parseNumber(client);

        const groupFormatted = { column: 'credit.group.id', value: groupParsed };
        const clientFormatted = { column: 'credit.client.id', value: clientParsed };

        let creditValue: number | string = Number(creditId);

        const areEmpty = group === '' && folder === '' && client === '';

        if(group && folder && client) {
          creditValue = '';
        }
        
        const idParsed = { column: 'credit.id', value: creditValue };
        const {
          page, limit, column, direction
        } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);

        return {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? defaultColumn, 
                direction,
                search: [
                  idParsed,
                  groupFormatted,
                  clientFormatted
                ]
            },
            search: {
                group,
                folder, 
                s: [groupFormatted],
            },
            validation: {
                creditValue,
                areEmpty
            }
        }
      }

      return {
        getParams
      }
}