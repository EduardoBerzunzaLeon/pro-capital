import { LoaderFunction, json } from '@remix-run/node';
import { Params } from '../../../../application/params';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ request }) => {
  await Service.auth.requirePermission(request, permissions.town.permissions.report);
  
    const { params } = Params.town.getParams(request);
    try {
      const data = await Service.town.exportData(params);
      console.log({data});
      return handlerSuccess(200, data);
    } catch (error) {
        console.log(error);
      return json(getEmptyData());
    }
}