import { LoaderFunction } from "@remix-run/node";
import { parseRangeDate } from "~/.server/reponses";
import { Service } from "~/.server/services";


export const loader: LoaderFunction =  async ({ request }) => {
    const url = new URL(request.url);

    const start = url.searchParams.get('start') || '';
    const end = url.searchParams.get('end') || '';

    const rangeDate = parseRangeDate(start, end);

    if(rangeDate === '') {
        return '';
    }

    try {
        const data = await Service.credit.findOverdueCredits(rangeDate);
        console.log({data});
        return data ?? '';
    } catch (error) {
        console.log({error});
        return '';
    }


}