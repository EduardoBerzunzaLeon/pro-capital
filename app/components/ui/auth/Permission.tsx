
import { PropsWithChildren } from 'react'
import { usePermission } from '../../../application/hook';

interface Props {
    permission: string,
}

export const Permission = ( { permission, children }: PropsWithChildren<Props> ) => {

  //  const fetcher = useFetcher();
   const { hasPermission } = usePermission({ permission })
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