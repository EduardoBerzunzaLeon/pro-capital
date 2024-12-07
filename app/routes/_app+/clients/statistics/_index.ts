import { json, LoaderFunction } from "@remix-run/node";
import { handlerError, parseRangeDate } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { flashSession } from "~/.server/utils/sessions";
import { permissions } from "~/application";


export const loader: LoaderFunction =  async ({ request }) => {

    await Service.auth.requirePermission(request, permissions.credits.permissions.statistics);
    const url = new URL(request.url);

    const start = url.searchParams.get('start') || '';
    const end = url.searchParams.get('end') || '';
    const folderId = url.searchParams.get('folder[id]') || 0;
    const folderName = url.searchParams.get('folder[value]') || '';

    const rangeDate = parseRangeDate(start, end);
    

    if(rangeDate === '') {
        return Service.credit.getDefaultStatistics(folderName);
    }

    try {
        return await Service.credit.findOverdueCredits(rangeDate, folderId, folderName);
    } catch (e) {
        const { error, status } = handlerError(e);
        // TODO: DO THIS IN GENERIC METHOD 
        const session = await flashSession.getSession(request.headers.get('Cookie'));
        const headers = new Headers();
        headers.append('Set-Cookie', await flashSession.commitSession(session));
        return json({ error, status }, { headers });
    }


}
