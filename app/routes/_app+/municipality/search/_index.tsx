import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request}) => {
  
    const url = new URL(request.url);
    const data = url.searchParams.get('data') || '';    

    // const url = new URL(request.url);
    // const page = url.searchParams.get('pm') || 1;
    // const limit = url.searchParams.get('lm') || 5;
    // const column = url.searchParams.get('cm') || 'name';
    // const direction = url.searchParams.get('dm') || 'ascending';

    if(data.length === 0){
        return [];
    }
    
    try {
        const dataDB = await Service.municipality.findByName(data.toLowerCase());
        return json({data: dataDB});    
    } catch (error) {
        console.log(error);
        return json([]);
    }

    

    // try {
    //   const data = await Service.municipality.findAll({
    //     page: Number(page), 
    //     limit: Number(limit), 
    //     column, 
    //     direction
    //   });

    //   return handlerSuccess<PaginationI<MunicipalityI>>(200, data);
    // } catch (error) {
    //   return [];  
    // }
    
}
