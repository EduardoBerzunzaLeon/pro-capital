import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { jsonWithError, jsonWithSuccess, redirectWithWarning } from "remix-toast";
import { Municipality } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
  const url = new URL(request.url);
  const page = url.searchParams.get('pm') || 1;
  const limit = url.searchParams.get('lm') || 5;
  const column = url.searchParams.get('cm') || 'name';
  const direction = url.searchParams.get('dm') || 'ascending';
  const searchData = url.searchParams.get('sm');
  
  try {
      const searchParsed = searchData 
      ? JSON.parse(searchData) 
      : [ { column: 'name', value: ''} ]

      const data = await Service.municipality.findAll({
        page: Number(page), 
        limit: Number(limit), 
        column, 
        direction,
        search: searchParsed
      });

      return handlerSuccess<PaginationI<Municipality>>(200, data);
    } catch (error) {
      return json({
        error: 'no data',
        serverData: { 
          data: [], 
          total: 0, 
          currentPage: 0,
          pageCount: 0
        }
      })  
    }
    
}

  export const action: ActionFunction = async({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      if(data._action === 'create') {
          await Service.municipality.createOne(formData);
          return jsonWithSuccess({ result: "Data created successfully", status:'success' }, `¡Creación exitosa del municipio ${data.name}! 🎉`);
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
      
    } catch (error) {
      const { error: errorMessage } = handlerError(error, { ...data });
      return jsonWithError(null, errorMessage);
    }
  }



