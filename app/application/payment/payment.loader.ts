import { LoaderFunction } from "@remix-run/node";
import { Generic } from "~/.server/interfaces";
import { parseArray, parseRangeDate, parseRangeInt } from "~/.server/reponses";

const columnsFilter = [
    'credit.client.fullname', 'credit.aval.fullname', 'credit.folder.name',
    'credit.group.name', 'credit.folder.town.name', 'status', 'credit.currentDebt', 
    'credit.folder.town.municipality.name', 'agent.fullName', 'folio', 'paymentDate', 'captureAt',
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
    const folder = url.searchParams.get('folder') || '';
    const municipality = url.searchParams.get('municipality') || '';
    const town = url.searchParams.get('town') || '';
    const group = url.searchParams.get('group') || '';
    const captureStart = url.searchParams.get('captureStart') || '';
    const captureEnd = url.searchParams.get('captureEnd') || '';
    const status = url.searchParams.get('status') || '';
    const debt = url.searchParams.get('debt') || '';
    const paymentAmount = url.searchParams.get('amount') || '';
    const paymentStart = url.searchParams.get('paymentStart') || '';
    const paymentEnd = url.searchParams.get('paymentEnd') || '';

    const statusParsed =  parseArray(status);
    const creditAtParsed = parseRangeDate(paymentStart, paymentEnd)
    const captureAtParsed = parseRangeDate(captureStart, captureEnd);
    const debtParsed = parseRangeInt(debt);
    const paymentAmountParsed = parseRangeInt(paymentAmount);

  }