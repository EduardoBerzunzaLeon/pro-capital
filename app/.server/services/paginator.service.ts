import { Metadata } from '../domain/interface/Base.repository.interface';
import { ServerError } from '../errors';
import { Generic } from '../interfaces';


interface PaginatorMapper<T extends Generic> {
    metadata: Metadata,
    data: Generic[]
    mapper: (data: Generic[]) => T[],
    errorMessage: string
}

export const mapper = <T extends Generic>({
    metadata,
    data,
    mapper,
    errorMessage
}: PaginatorMapper<T>) => {

    if(metadata.total === 0) {
        throw ServerError.notFound(errorMessage);
    }

    const dataMapped = mapper(data);

    return {
        data: dataMapped,
        ...metadata
    }
}

export default {
    mapper
}