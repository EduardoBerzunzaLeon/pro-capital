import { json } from "@remix-run/node";
import { HandlerSuccess } from "./handler.interface";

export const handlerSuccess = <T>(status: number, data: T)  => {
    return json<HandlerSuccess<T>>({
        status: 'success',
        serverData: { ...data },
        error: null
    }, status)
}