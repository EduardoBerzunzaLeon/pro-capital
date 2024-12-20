import { RoleTypes } from "@prisma/client";
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

    
    async function findByReport(paginationData: PaginationWithFilters) {
        return await base.findManyByReportExcel({
            paginatonWithFilter: paginationData,
            select: {
                role: true
            }
        })
    }

    async function findPermission(roleName: RoleTypes, permission: string) {
        return await base.findOne({
            role: roleName,
                permissions: {
                    some: {
                        servername: permission
                    }
                }
            },
            {
                id: true,
                role: true,
            }
        )
    }

    async function findById(id: number) {
      return await base.findOne({ id },{ id: true, role: true });
    }

    return {
        findMany,
        findAll,
        findByReport,
        findPermission,
        findById,
        base
    }
}