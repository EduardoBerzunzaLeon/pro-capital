import { json, LoaderFunction } from "@remix-run/node";
import { Generic } from "~/.server/interfaces";
import { getEmptyPagination, handlerPaginationParams, handlerSuccess, parseNumber } from "~/.server/reponses";
import { Service } from "~/.server/services";

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


  export const paymentClientLoader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const group = url.searchParams.get('group') || '';
    const { creditId } = params;

    try {
        const groupParsed = parseNumber(group);
        const idParsed = { column: 'credit.id', value: Number(creditId) };
        // TODO: PASS CLIENTID, AND GROUPiD, IF EXITS IGNORE IDPARSED
        const groupFormatted = { column: 'credit.group.id', value: groupParsed };

        const {
          page, limit, column, direction
        } = handlerPaginationParams(request.url, 'captureAt', columnsFilter);
          
        const data = await Service.payment.findAll({
          page, 
          limit, 
          column: columnSortNames[column] ?? 'captureAt', 
          direction,
          search: [
            idParsed,
            groupFormatted,
          ]
        });

        return handlerSuccess(200, { 
          ...data,
          p: page,
          l: limit,
          c: column,
          d: direction,
          s: [groupFormatted],
          group
        });

    } catch (e) {
        return json(getEmptyPagination({ group }));
    }
  }