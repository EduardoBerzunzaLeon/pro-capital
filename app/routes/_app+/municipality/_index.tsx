import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { MunicipalityI } from "~/.server/domain/entity";
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
  const search = url.searchParams.get('sm') || '';
  
  try {
      const data = await Service.municipality.findAll({
        page: Number(page), 
        limit: Number(limit), 
        column, 
        direction,
        search
      });

      return handlerSuccess<PaginationI<MunicipalityI>>(200, data);
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
      }
      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });
    } catch (error) {
      return handlerError(error, { ...data });
    }
  }

