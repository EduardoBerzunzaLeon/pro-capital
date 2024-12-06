import { useRouteLoaderData } from '@remix-run/react';
import { User } from '../../.server/domain/entity/user.entity';
import {useMemo} from 'react';

interface Props {
    permission: string,
}
export const usePermission = ({ permission }: Props) =>  {
    const { user } = useRouteLoaderData('root') as { user: Omit<User, 'password'> };

    const hasPermission = useMemo(() =>  {
       if(!user) {
         return false;
       }
 
       const find = user.permissions.find(({servername}) => servername === permission);
 
       return !!find;
 
    },[permission, user]);

    return { hasPermission }
}