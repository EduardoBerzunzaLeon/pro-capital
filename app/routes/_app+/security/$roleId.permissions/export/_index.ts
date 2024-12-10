import { LoaderFunction, json } from '@remix-run/node';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';
import { permissions } from '~/application';
import { Params } from '~/application/params';

export const loader: LoaderFunction = async ({ request, params }) => {
    await Service.auth.requirePermission(request, permissions.roles.permissions.report_permissions);
    const { roleId } = params;
    const { params: urlParams } = Params.permission.getParams(request);

    try {
      const data = await Service.permission.exportData(roleId, urlParams);
      console.log({data});
      return handlerSuccess(200, data);
    } catch (error) {
        console.log(error);
      return json(getEmptyData());
    }
}