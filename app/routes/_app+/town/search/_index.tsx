import { LoaderFunction } from "@remix-run/node";
import { handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request}) => {
  
    const url = new URL(request.url);
    const data = url.searchParams.get('data') || '';    

    if(data.length === 0){
        return [];
    }
    
    try {
        const dataDB = await Service.town.findByName(data.toLowerCase());
        return handlerSuccess(200, dataDB);
    } catch (error) {
        console.log(error);
        return handlerSuccess(200, []);
    }
    
}
