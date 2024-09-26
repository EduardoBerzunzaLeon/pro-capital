import { LoaderFunction } from "@remix-run/node";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {

    const url = new URL(request.url);
    const folderId = url.searchParams.get('id') || '0';

    try {
        const group = await Service.folder.findLastGroup(folderId);
        return handlerSuccess(200, { group });
    } catch (error) {
        return handlerError(error);
    }

}
