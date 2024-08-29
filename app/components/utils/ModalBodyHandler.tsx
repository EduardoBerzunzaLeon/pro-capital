import { ModalBody, Spinner } from "@nextui-org/react";
import { ErrorCard } from "./ErrorCard";

interface Props {
    state: string
    loadingMessage: string
    error?: string | unknown,
}

export const ModalBodyHandler = ({ error, state, loadingMessage }: Props) => {

    const hasError = error && state === 'idle';
    const isLoading = state !== 'idle';

  return (
    <>
        {
            (hasError) && (
                <ModalBody >
                <ErrorCard error={error} />
                </ModalBody>
            )
        }

        {
            (isLoading) && (
            <ModalBody>
                <Spinner 
                label={loadingMessage}
                />
            </ModalBody>
            )
        }
    </>
  )
}
