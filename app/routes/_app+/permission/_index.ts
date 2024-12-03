import { RoleTypes } from '@prisma/client';
import { LoaderFunction } from '@remix-run/node';
import { handlerError } from '~/.server/reponses';
import { Service } from '~/.server/services';

export const loader: LoaderFunction = async ({ request }) => {
        const url = new URL(request.url);
        const permission = url.searchParams.get('permission') || '';
        const role = url.searchParams.get('role') || '';

        try {
            const hasPermission = await Service.role.hasPermission(role as RoleTypes, permission);

            return !!hasPermission;
        } catch (error) {
            console.log({error});
            return  handlerError(error, { permission, role });
        }
}