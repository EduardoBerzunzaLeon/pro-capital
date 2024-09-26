import { LoaderFunction } from "@remix-run/node";
import { handlerAutocomplete } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
    // TODO: add flag "only active folders"
    return handlerAutocomplete(request.url, Service.folder.findAutocomplete);
}
