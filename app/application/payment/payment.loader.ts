import { json, LoaderFunction } from "@remix-run/node";
import { Generic } from "~/.server/interfaces";
import { getEmptyPagination, handlerPaginationParams, handlerSuccess, parseArray, parseNumber, parseRangeDate, parseRangeInt } from "~/.server/reponses";
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


  export const paymentLoader: LoaderFunction = async ({ request }) => {

    const url = new URL(request.url);

    const curp = url.searchParams.get('curp') || '';
    const aval = url.searchParams.get('aval') || '';
    const client = url.searchParams.get('client') || '';
    const agent = url.searchParams.get('agent') || '';
    const folder = url.searchParams.get('folder') || '';
    const group = url.searchParams.get('group') || '';
    const municipality = url.searchParams.get('municipality') || '';
    const town = url.searchParams.get('town') || '';
    const captureStart = url.searchParams.get('captureStart') || '';
    const captureEnd = url.searchParams.get('captureEnd') || '';
    const status = url.searchParams.get('status') || '';
    const debt = url.searchParams.get('debt') || '';
    const paymentAmount = url.searchParams.get('paymentAmount') || '';
    const paymentStart = url.searchParams.get('paymentStart') || '';
    const paymentEnd = url.searchParams.get('paymentEnd') || '';

    const statusParsed = parseArray(status);
    const paymentDate = parseRangeDate(paymentStart, paymentEnd)
    const captureAtParsed = parseRangeDate(captureStart, captureEnd);
    const debtParsed = parseRangeInt(debt);
    const paymentAmountParsed = parseRangeInt(paymentAmount);
    const groupParsed = parseNumber(group);

    

    try {
      
      const curpParsed = { column: 'credit.client.curp', value: curp };
      const folderParsed = { column: 'credit.folder.name', value: folder };
      const fullnameParsed = { column: 'credit.client.fullname', value: client };
      const fullnameAvalParsed = { column: 'credit.aval.fullname', value: aval };
      const fullnameAgentParsed = { column: 'agent.fullName', value: agent };
      const statusFormatted = { column: 'status', value: statusParsed };
      const paymentDateFormatted = { column: 'paymentDate', value: paymentDate };
      const captureAtFormatted = { column: 'captureAt', value: captureAtParsed };
      const debtFormatted = { column: 'credit.currentDebt', value: debtParsed };
      const paymentAmountFormatted = { column: 'paymentAmount', value: paymentAmountParsed };
      const municipalityFormatted = { column: 'credit.folder.town.municipality.name', value: municipality };
      const townFormatted = { column: 'credit.folder.town.name', value: town };
      const groupFormatted = { column: 'credit.group.name', value: groupParsed };

      const {
        page, limit, column, direction
      } = handlerPaginationParams(request.url, 'captureAt', columnsFilter);
      const data = await Service.payment.findAll({
        page, 
        limit, 
        column: columnSortNames[column] ?? 'captureAt', 
        direction,
        search: [
          curpParsed, 
          folderParsed, 
          fullnameParsed, 
          fullnameAgentParsed,
          statusFormatted, 
          paymentAmountFormatted,
          debtFormatted,
          captureAtFormatted,
          paymentDateFormatted,
          fullnameAvalParsed,
          municipalityFormatted,
          townFormatted,
          groupFormatted,
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
        aval,
        client,
        agent,
        municipality,
        status: statusParsed,
        town,
        captureStart,
        captureEnd,
        debt: debtParsed,
        paymentAmount: paymentAmountParsed,
        paymentStart,
        paymentEnd,
        group
      });

    } catch (e) {
      console.log(e);
      return json(getEmptyPagination({
        curp,
        folder,
        aval,
        client,
        agent,
        municipality,
        status: statusParsed,
        town,
        debt: debtParsed,
        group,
        captureStart,
        captureEnd,
        paymentAmount: paymentAmountParsed,
        paymentStart,
        paymentEnd,
      }));
    }

  }