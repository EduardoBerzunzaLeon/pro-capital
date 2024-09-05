import { parseDate } from "@internationalized/date";
import { LoaderFunction } from "@remix-run/node";
import { Service } from "~/.server/services"


export const loader: LoaderFunction = async ({ request}) => {
    try {
        const url = new URL(request.url);
        const data = url.searchParams.get('data') || '';
        const assignAt  = url.searchParams.get('assignAt') || '';
        const date = parseDate(assignAt).toDate('America/Mexico_City');
        return await Service.agent.findAgentsAutocomplete(data.toLowerCase(), date)
        
    } catch (error) {
        console.log(error);
    }
}
