import { useMemo } from 'react';
import { useRouteLoaderData } from '@remix-run/react';
import { User } from '../../.server/domain/entity/user.entity';

interface Props {
    permissions: string[]
}

export const useMultiplePermissions = ({ permissions }: Props) => {

    const { user } = useRouteLoaderData('root') as { user: Omit<User, 'password'> };

    const hasAllPermissions = useMemo(() =>  {
       if(!user) {
         return false;
       }

        const hasPermissions = permissions.every((permission) => !!user.permissions.find(({ 
            servername 
        }) => servername === permission ));
    
        return hasPermissions;
 
    },[permissions, user]);

    const hasOnePermissions = useMemo(() =>  {

       if(!user) {
         return false;
       }

        const hasPermissions = permissions.some((permission) => !!user.permissions.find(({ 
            servername 
        }) => servername === permission ));
    
        return hasPermissions;
 
    },[permissions, user]);

    return { hasAllPermissions, hasOnePermissions };

}