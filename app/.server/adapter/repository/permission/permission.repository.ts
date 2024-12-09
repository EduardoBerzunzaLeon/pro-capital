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

    
    async function findByReport(paginationData: PaginationWithFilters) {
        return await base.findManyByReportExcel({
            paginatonWithFilter: paginationData,
            select: {
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


    async function unassignRole(roleId: number, permissionId: number) {
        return await base.entity.update({
            where: {
                id: permissionId,
            },
            data: {
                roles: {
                    disconnect: [{ id: roleId }]
                }
            }
        });
    }
    
    async function assignRole(roleId: number, permissionId: number) {
        return await base.entity.update({
            where: {
                id: permissionId,
            },
            data: {
                roles: {
                    connect: [{ id: roleId }]
                }
            }
        });
    }

    return {
        findAll,
        findByReport,
        unassignRole,
        assignRole,
        base
    }

}