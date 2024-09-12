import { useFetcher } from "@remix-run/react"
import { ModalSubscribeLeader } from "./ModalSubscribeLeader";
import { HandlerSuccess } from "~/.server/reponses";
import { Leader } from "~/.server/domain/entity";
import { ModalUnsubscribeLeader } from "./ModalUnsubscribeLeader";

interface Props {
    leaderId: number,
    handleSelectedId: (id: number) => void
}
 
export const ModalsToggle = ({ leaderId, handleSelectedId }: Props) => {

    const fetcher = useFetcher<HandlerSuccess<Leader>>({ key: `getLeader-${leaderId}` });
    const isDone = fetcher.data && fetcher.state === 'idle' && fetcher.data?.serverData;
    const subscribeIsVisible =  isDone && fetcher.data?.serverData.isActive === false;
    const unsubscribeIsVisible =  isDone && fetcher.data?.serverData.isActive;

    console.log({fetcher, leaderId, subscribeIsVisible});

    if(leaderId <= 0) {
        return null;
    }

    return (
    <>
        <ModalSubscribeLeader 
            fullname={fetcher.data?.serverData.fullname ?? ''} 
            id={fetcher.data?.serverData.id ?? 0}
            handleSelectedId={handleSelectedId}
            isVisible={subscribeIsVisible}
            folderName={fetcher.data?.serverData.folder.name ?? ''}
        />
        <ModalUnsubscribeLeader 
            fullname={fetcher.data?.serverData.fullname ?? ''} 
            id={fetcher.data?.serverData.id ?? 0}
            handleSelectedId={handleSelectedId}
            isVisible={unsubscribeIsVisible}
        />
    </>);
    

}