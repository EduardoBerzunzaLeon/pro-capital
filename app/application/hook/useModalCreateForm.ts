import { useEffect } from "react";

import { useDisclosure } from "@nextui-org/react";
import { FormMetadata } from "@conform-to/react";
import { GenericUnknown } from "~/.server/interfaces";

interface Props<T extends GenericUnknown> {
    state: 'idle' | 'submitting' | 'loading',
    form: FormMetadata<T, string[]>
    status?: string,
}

export const useModalCreateForm = <T extends GenericUnknown>({ form, state, status }: Props<T>) => {


    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const wasCreated = state === 'idle' && status === 'success' 
      && isOpen;
    const isCreating = state !== 'idle';

    useEffect(() => {
        if(wasCreated && form.value?._action) {
          onClose();
          form.reset(); 
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [wasCreated]);

      useEffect(() => {
        if(!isOpen && form?.status === 'error') {
            form.reset()        
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen]);

    

    return {
        isOpen,
        onOpenChange,
        onOpen,
        onClose,
        wasCreated,
        isCreating
    }

}