import { LoaderFunction, json } from '@remix-run/node';
import { Service } from '~/.server/services';
import { getEmptyData, handlerSuccess } from '~/.server/reponses';
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ request }) => {
    await Service.auth.requirePermission(request, permissions.leaders.permissions.report_birthday);
    const date = new Date();
    const url = new URL(request.url);
    const month = url.searchParams.get('month') ?? date.getMonth() + 1;
    const day = url.searchParams.get('day') ?? date.getDate();

    try {
      const data = await Service.leader.exportBirthdays({ month, day });
      return handlerSuccess(200, data);
    } catch (error) {
      return json(getEmptyData());
    }
}