import { useRouteLoaderData } from '@remix-run/react';
import { PropsWithChildren, useMemo } from 'react'
import { User } from '../../../.server/domain/entity/user.entity';

interface Props {
    permission: string,
}

export const Permission = ( { permission, children }: PropsWithChildren<Props> ) => {

  //  const fetcher = useFetcher();
   const { user } = useRouteLoaderData('root') as { user: Omit<User, 'password'> };

   const hasPermission = useMemo(() =>  {
      if(!user) {
        return false;
      }

      const find = user.permissions.find(({servername}) => servername === permission);

      return !!find;

   },[permission, user]);
  //  console.log({ fetcher, user });
  // useEffect(() => {
  //   fetcher.submit({
  //     role: user.role,
  //     permission,
  //   }, { 
  //     method: 'GET',
  //     action: '/permission'
  //   });
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //  }, [permission, user.role]);


  //  if(fetcher.state !== 'idle') {
  //     return null;
  //  }

  //  if(!fetcher.data) {
  //    return null;
  //  }

  if(!hasPermission) {
    return null;
  }
  

  return (
    <> {children} </>
  )
}