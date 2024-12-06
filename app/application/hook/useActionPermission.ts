import { useRouteLoaderData } from '@remix-run/react';
import { User } from '~/.server/domain/entity';


interface Props {
    view?: string,
    update?: string,
    destroy?: string
}

export const useActionPermission = ({ view, update, destroy }: Props) => {

    const { user } = useRouteLoaderData('root') as { user: Omit<User, 'password'> };

    const hasPermission = (user: Omit<User, 'password'>, permission?: string) => {
        if(!user) {
            return false;
        }

        if(!permission) {
            return true;
        }

        const find = user.permissions.find(({servername}) => servername === permission);
 
        return !!find;
    }

    const hasViewPermission = hasPermission(user, view);
    const hasDeletePermission = hasPermission(user, destroy);
    const hasUpdatePermission = hasPermission(user, update);

    return {
        hasViewPermission,
        hasDeletePermission,
        hasUpdatePermission,
    }

}