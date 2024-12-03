import { useFetcher } from '@remix-run/react';
import React, { PropsWithChildren } from 'react'

interface Props {
    permission: string,
}

export const Permission = ( { permission, children }: PropsWithChildren<Props> ) => {

    // TODO: MAKE A CUSTOM HOOK usePermission
//    const fetcher = useFetcher();


  return (
    <div>
        {children}
    </div>
  )
}