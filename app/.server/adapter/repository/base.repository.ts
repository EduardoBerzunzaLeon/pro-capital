
import { Generic } from "~/.server/interfaces";
import { apiPrismaFeatures, db } from "../";
import { BaseRepositoryI, FindManyProps, FindManyWithPaginatorProps } from "~/.server/domain/interface";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";


export function baseRepository<
    P extends Generic, 
    S,
    D extends Generic,
    C extends Generic,
    O extends Generic
>(entity: Prisma.ModelName): BaseRepositoryI<P, S, D, C, O> {

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
            return await db['user'].findUnique(params);
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
    
    async function findMany({ searchParams, select, take, orderBy }: FindManyProps<P,S,O>) {
        const params =  prepareParams(searchParams, select);
        return await entity.findMany({ ...params, take: take ?? 10, orderBy });
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
    
    async function createMany(data: C[], skipDuplicates: boolean = false) {
        return await entity.createManyAndReturn({ 
            data,
            skipDuplicates
        });
    }

    async function createManyAndReturn(data: C[], skipDuplicates: boolean = false) {
        return await entity.createManyAndReturn({ 
            data,
            skipDuplicates
        });
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
        createMany,
        createManyAndReturn,
        entity
    }
}