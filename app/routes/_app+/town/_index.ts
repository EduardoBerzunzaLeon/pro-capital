import { json, LoaderFunction } from "@remix-run/node";
import { TownI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { handlerSuccess } from "~/.server/reponses";
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