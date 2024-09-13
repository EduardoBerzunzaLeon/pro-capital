import { Pagination as PaginationNext } from "@nextui-org/react";
import { ClientOnly } from "remix-utils/client-only";

interface Props {
    currentPage?: number,
    pageCount?: number
    onChange?: (page: number) => void
}

export function Pagination({ onChange, currentPage, pageCount }: Props) {
    
    const hasPagination = (pageCount && pageCount > 0) || false;

    return (
        <>
            {
                hasPagination && (
                    <ClientOnly>
                        {
                            () => (

                                <div className="flex w-full justify-center">
                                    <PaginationNext
                                        isCompact
                                        showControls
                                        showShadow
                                        color="secondary"
                                        page={currentPage || 0}
                                        total={pageCount || 0}
                                        onChange={onChange}
                                    />
                                </div>
                            )
                        }
                    </ClientOnly>
                ) 
            }
        </>
    )

}