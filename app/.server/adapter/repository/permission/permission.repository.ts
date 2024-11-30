import { BasePermissionI, PaginationWithFilters, PermissionRepositoryI } from "~/.server/domain/interface";


export function PermissionRepository(base: BasePermissionI): PermissionRepositoryI {


    async function findAll( paginationData: PaginationWithFilters ) {
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                name: true,
                description: true,
                module:  {
                    select: {
                        name: true,
                    }
                },
                roles: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        })
    }

    return {
        findAll,
        base
    }

}