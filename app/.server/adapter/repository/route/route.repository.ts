import { PaginationWithFilters } from "~/.server/domain/interface";
import { BaseRouteI, RouteRepositoryI } from "~/.server/domain/interface/Route.repository.interface";


export function RouteRepository(base: BaseRouteI): RouteRepositoryI {

    async function findAll(paginationData: PaginationWithFilters) {

        console.log(paginationData);

        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                name: true,
                isActive: true
            }
        })
    }

    async function findLastRoute() {
        const data = await base.entity.aggregate({
            _max: { name: true }
        });

        const { name } = data._max;
        return name ?? 0;
    }

    async function findMany() {
        return await base.findMany({ 
            select: { 
                name: true, 
                id: true, 
                isActive: true 
            }, 
            take: 100 
        });
    }

    async function findIsActive(id: number) {
        return await base.findOne({id}, { isActive: true });
    }

    async function updateIsActive(id: number, isActive: boolean) {
        return await base.updateOne({id}, { isActive: !isActive })
    }

    async function createOne(name: number) {
        return await base.createOne({ name, isActive: true })
    }


    async function findCountFolders(id: number) {
        const select = {
            name: true,
            _count: {
                select: {
                    folders: true
                }
            }
        }
        return await base.findOne({id}, select, true);
    }

    async function deleteOne(id:number) {
        return await base.deleteOne({ id });
    }

    
    return  {
        findAll,
        findLastRoute,
        findMany,
        findIsActive,
        updateIsActive,
        createOne,
        findCountFolders,
        deleteOne,
        base
    }

}