import { LoaderFunction, json } from '@remix-run/node';
import { Params } from '../../../../application/params';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ request }) => {
    await Service.auth.requirePermission(request, permissions.route.permissions.report);
    const { params } = Params.route.getParams(request);

    try {
      const data = await Service.routes.exportData(params);
      return handlerSuccess(200, data);
    } catch (error) {
      return json(getEmptyData());
    }
}