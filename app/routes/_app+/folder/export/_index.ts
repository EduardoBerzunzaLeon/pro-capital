import { LoaderFunction, json } from '@remix-run/node';
import { Params } from '../../../../application/params';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';

export const loader: LoaderFunction = async ({ request }) => {
    const { params } = Params.folder.getParams(request);
    try {
      const data = await Service.folder.exportData(params);
      return handlerSuccess(200, data);
    } catch (error) {
      return json(getEmptyData());
    }
}