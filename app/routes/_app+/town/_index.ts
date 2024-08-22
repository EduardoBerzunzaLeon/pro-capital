import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { TownI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
    const url = new URL(request.url);
    const page = url.searchParams.get('pm') || 1;
    const limit = url.searchParams.get('lm') || 5;
    const column = url.searchParams.get('cm') || 'name';
    const direction = url.searchParams.get('dm') || 'ascending';
    
    const searchData = url.searchParams.get('sm') || `[
      { column: 'name', value: ''},
      { column: 'municipality', value: ''},
    ]`;
    
    try {

      const searchParsed = JSON.parse(searchData);
      const data = await Service.town.findAll({
        page: Number(page), 
        limit: Number(limit), 
        column, 
        direction,
        search: searchParsed
      });
      
      return handlerSuccess<PaginationI<TownI>>(200, data);
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



  export const action: ActionFunction = async({ request }) => {

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // console.log({dataCreated: data});
    const municipalityId = data['municipality[id]']+'';
    const { name } = data;

    try {
      if(data._action === 'create') {
          await Service.town.createOne(municipalityId, name+'');
      }
      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });
    } catch (error) {
      console.log(error);
      return handlerError(error, { ...data });
    }
  
  }