import { LoaderFunction } from "@remix-run/node";
import { ServerError } from "~/.server/errors";
import { Generic } from "~/.server/interfaces";
import { handlerError, handlerPaginationParams, handlerSuccess, parseNumber } from "~/.server/reponses";
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
    const group = url.searchParams.get('g') || '';
    const folder = url.searchParams.get('f') || '';
    const client = url.searchParams.get('cl') || '';
    const { creditId } = params;

    try {
        const groupParsed = parseNumber(group);
        const clientParsed = parseNumber(client);

        // TODO: PASS CLIENTID, AND GROUPiD, IF EXITS IGNORE IDPARSED
        const groupFormatted = { column: 'credit.group.id', value: groupParsed };
        const clientFormatted = { column: 'credit.client.id', value: clientParsed };
        
        let creditValue: number | string = Number(creditId);

        const areEmpty = group === '' && folder === '' && client === '';
        
        if(group && folder && client) {
          creditValue = '';
        }

        if(!areEmpty && creditValue !== '') {
          console.log('error perra');
          throw ServerError.badRequest('La solicitud a la URL es incorrecta, favor de verificar la ruta de acceso');
          // ?g=2&cl=1&f=
        }
        
        const idParsed = { column: 'credit.id', value: creditValue };
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
            clientFormatted
          ]
        });

        return handlerSuccess(200, { 
          ...data,
          p: page,
          l: limit,
          c: column,
          d: direction,
          s: [groupFormatted],
          group,
          folder
        });

    } catch (e) {
      const { error, status } = handlerError(e);
      throw new Response(error, { status });
    }
  }