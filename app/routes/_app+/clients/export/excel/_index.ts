import { LoaderFunction, json } from '@remix-run/node';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';
import { permissions } from '~/application';
import { Params } from '~/application/params';

export const loader: LoaderFunction = async ({ request }) => {
    await Service.auth.requirePermission(request, permissions.credits.permissions.report);
    const { params } = Params.credit.getParams(request);

    try {
      const data = await Service.credit.exportData(params);
      return handlerSuccess(200, data);
    } catch (error) {
      return json(getEmptyData());
    }
}