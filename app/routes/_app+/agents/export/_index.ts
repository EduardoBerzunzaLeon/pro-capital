import { LoaderFunction, json } from '@remix-run/node';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';
import { permissions } from '~/application';
import { Params } from '~/application/params';

export const loader: LoaderFunction = async ({ request }) => {
    await Service.auth.requirePermission(request, permissions.agents.permissions.report);
    const { params } = Params.agent.getParams(request);

    try {
      const data = await Service.agent.exportData(params);
      return handlerSuccess(200, data);
    } catch (error) {
        console.log(error);
      return json(getEmptyData());
    }
}