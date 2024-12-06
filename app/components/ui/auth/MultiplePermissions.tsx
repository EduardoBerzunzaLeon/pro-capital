import { useMultiplePermissions } from '../../../application/hook';
import { PropsWithChildren } from 'react';


interface Props {
    permissions: string[],
    type?: 'all' | 'some'
}
export const MultiplePermissions = ({ permissions, type = 'some', children }: PropsWithChildren<Props>) => {

    const { hasAllPermissions, hasOnePermissions } = useMultiplePermissions({ permissions })

 
  if(!hasAllPermissions && type === 'all') {
    return null;
  }

  if(!hasOnePermissions && type === 'some') {
    return null;
  }
  
  return (
    <> {children} </>
  )
}
