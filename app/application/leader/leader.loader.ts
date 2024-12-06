import { json, LoaderFunction } from "@remix-run/node";

import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { Params } from '../params/index';
import { permissions } from '~/application';


export const leaderLoader: LoaderFunction = async ({ request }) => {
  
  await Service.auth.requirePermission(request, permissions.leaders.permissions.view);
  
  const { params, search } = Params.leader.getParams(request);

  try {
  
    const data = await Service.leader.findAll(params);
    const { page, limit, column, direction } = params;
    
    return handlerSuccess(200, { 
      ...data,
      ...search,
      p: page,
      l: limit,
      c: column,
      d: direction
    });
    
  } catch (error) {
      console.log({error});
      return json(getEmptyPagination(search));
  }
}
