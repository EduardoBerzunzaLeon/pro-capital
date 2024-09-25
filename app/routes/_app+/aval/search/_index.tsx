import { LoaderFunction } from "@remix-run/node";
import { handlerAutocomplete } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request}) => {
    return handlerAutocomplete(request.url, Service.aval.findAutocomplete);
}
