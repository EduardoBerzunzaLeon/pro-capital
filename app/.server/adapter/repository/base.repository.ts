
import { Generic } from "~/.server/interfaces";
import { apiPrismaFeatures } from "../";
import { BaseRepositoryI, FindManyProps, FindManyWithPaginatorProps } from "~/.server/domain/interface";

export function baseRepository<
    T extends Generic, 
    P extends Generic, 
    S,
    D extends Generic,
    C extends Generic
>(entity: T): BaseRepositoryI<T, P, S, D, C> {

    function prepareParams(searchParams?: P, select?: S) {

        if(!searchParams && !select) {
            return null
        }
        let params = null;

        if(searchParams) {
            params = { where: searchParams }
        }

        if(select) {
            params = { ...params, select }
        }
        
        return params;
    }

    async function findOne(searchParams: P, select?: S, isUnique: boolean = false) {
        const params = prepareParams(searchParams, select);
        if(isUnique) {
            return await entity.findUnique(params);
        }
        return await entity.findFirst(params); 
    }

    async function findManyPaginator({ searchParams, select, paginatonWithFilter }: FindManyWithPaginatorProps<P,S>) {
        
        const apiPrisma = apiPrismaFeatures(paginatonWithFilter);

        const filter = apiPrisma.filter();
        const orderBy = apiPrisma.orderBy();
        const paginate = apiPrisma.paginate();
        const whereAssign = Object.assign({}, searchParams, filter );
        const params = prepareParams(whereAssign, select);

        const [data, total] = await Promise.all([
            entity.findMany({...params, ...paginate, orderBy }),
            entity.count({ where: whereAssign })
        ]);

        const metadata =  apiPrisma.getMetadata(total);

        return { 
            data, 
            metadata
        }   
    }
    
    async function findMany({ searchParams, select, take }: FindManyProps<P,S>) {
        const params =  prepareParams(searchParams, select);
        return await entity.findMany({ ...params, take: take ?? 10 });
    }

    async function updateOne(searchParams: P, data: D) {
        return await entity.update({
            where: { ...searchParams },
            data: { ...data }
        });
    } 

    async function updateMany(searchParams: P, data: D) {
        return await entity.updateMany({
            where: { ...searchParams },
            data: { ...data }
        });
    } 


    async function deleteOne(searchParams: P) {
        return await entity.delete({ where: { ...searchParams }});
    }
    
    async function deleteMany(searchParams: P) {
        return await entity.deleteMany({ where: { ...searchParams }});
    }

    async function createOne(data: C) {
        return await entity.create({ data: { ...data }});
    }

    return {
        findOne,
        findMany,
        findManyPaginator,
        updateOne,
        updateMany,
        deleteOne,
        deleteMany,
        createOne,
        entity
    }
}