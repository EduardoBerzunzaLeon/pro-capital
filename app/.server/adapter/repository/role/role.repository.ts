import { BaseRoleI, PaginationWithFilters, RoleRepositoryI } from "~/.server/domain/interface";


export function RoleRepository(base: BaseRoleI): RoleRepositoryI {
    async function findMany() {
        return await base.findMany({
            select: {
                role: true,
                id: true
            },
            take: 100
        })
    }

    async function findAll( paginationData: PaginationWithFilters ) {
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                role: true
            }
        })
    }

    return {
        findMany,
        findAll,
        base
    }
}