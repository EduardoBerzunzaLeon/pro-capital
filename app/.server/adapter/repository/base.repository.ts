
import { Generic } from "~/.server/interfaces";
import { BaseRepositoryI, FindManyProps, FindManyWithPaginatorProps } from "./base.repository.inteface";
import { apiPrismaFeatures } from "../paginator";

export function baseRepository<T extends Generic>(entity: T): BaseRepositoryI {

    function prepareParams(searchParams: Generic, select?: Generic) {
        const whereSection = { where: { ...searchParams } };
        return select 
            ? { ...whereSection, select: {...select} }
            : whereSection;
    }

    async function findOne(searchParams: Generic, select?: Generic, isUnique: boolean = false) {
        const params = prepareParams(searchParams, select);
        if(isUnique) {
            return await entity.findUnique(params);
        }
        return await entity.findOne(params); 
    }

    async function findManyPaginator({ searchParams, select, paginatonWithFilter }: FindManyWithPaginatorProps) {
        
        const { 
            orderBy, 
            filter, 
            paginate,
            getMetadata
         } = apiPrismaFeatures(paginatonWithFilter);

        const search = searchParams ?? {};
        
        const params = filter 
            ? prepareParams({ ...search, ...filter}, select)
            : prepareParams(search, select);

        const [data, total] = await Promise.all([
            entity.findMany({...params, ...paginate, orderBy: orderBy }),
            entity.count(params)
        ]);

        const metadata =  getMetadata(total);

        return { 
            data, 
            metadata
        }   
    }
    
    async function findMany({ searchParams, select, take }: FindManyProps) {
        const params =  prepareParams(searchParams, select);
        return await entity.findMany({ ...params, take: take ?? 10 });
    }

    async function updateOne(searchParams: Generic, data: Generic) {
        return await entity.update({
            where: { ...searchParams },
            data: { ...data }
        });
    } 

    async function deleteOne(searchParams: Generic) {
        return await entity.delete({ where: { ...searchParams }});
    }
    
    async function deleteMany(searchParams: Generic) {
        return await entity.deleteMany({ where: { ...searchParams }});
    }

    async function createOne(data: Generic) {
        return await entity.create({ data: { ...data }});
    }

    return {
        findOne,
        findMany,
        findManyPaginator,
        updateOne,
        deleteOne,
        deleteMany,
        createOne,
        entity
    }
}