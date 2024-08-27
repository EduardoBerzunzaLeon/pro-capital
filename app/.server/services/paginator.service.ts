import { Metadata } from '../adapter/repository/base.repository.inteface';
import { ServerError } from '../errors';
import { Generic } from '../interfaces';

interface MapperClass {
    mapper: (data: Generic[]) => Generic[]
}

interface PaginatorMapper<T extends MapperClass> {
    metadata: Metadata,
    data: Generic[]
    entityMapper: T,
    errorMessage: string
}

export const mapper = <T extends MapperClass>({
    metadata,
    data,
    entityMapper,
    errorMessage
}: PaginatorMapper<T>) => {

    if(metadata.total === 0) {
        throw ServerError.notFound(errorMessage);
    }

    const dataMapped = entityMapper.mapper(data);

    return {
        data: dataMapped,
        ...metadata
    }
}

export default {
    mapper
}