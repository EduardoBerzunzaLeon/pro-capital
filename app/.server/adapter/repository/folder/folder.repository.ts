import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { BaseFolderI, FolderRepositoryI } from "~/.server/domain/interface";

export function FolderRepository(base: BaseFolderI) : FolderRepositoryI {

    async function findLastConsecutive( townId: number ) {

        const data = await base.entity.aggregate({
            where: { townId },
            _max: { consecutive: true }
        });

        const { consecutive  } = data._max;

        return consecutive ?? 0;
    }
    
    async function findAutocomplete(name: string)  {
        return await base.findMany({
            searchParams: { name: { contains: name } },
            select: { id: true, name: true }
        });
    }

    // TODO: traer solo las lideres activas
    async function findAll( paginationData: PaginationWithFilters ) {
        return await base.findManyPaginator({
                paginatonWithFilter: paginationData,
                select: {
                    id: true,
                    name: true,
                    town: {
                        select: {
                            name: true,
                            municipality: {
                                select: { name: true }
                            }
                        }
                    },
                    route: { select: { name: true } },
                    leader: {
                        select: {
                            name: true,
                            lastNameFirst: true,
                            lastNameSecond: true,
                        }
                    },
                    _count: {
                        select: {
                            groups: true
                        }
                    }
                } 
            }); 
    }

    async function findOne(id: number) {
        const select = {
            id: true,
            name: true,
            consecutive: true,
            route: {
                select: {
                    name: true,
                    id: true,
                }
            }
        }

        return await base.findOne({ id }, select, true);
    }

    async function updateOne(id: number, routeId: number) {
        return await base.updateOne({ id }, { routeId });
    }

    async function findCountGroups(id: number) {
        const select = { 
            name: true,
            _count: {
                select: {
                    groups: true
                }
            }, 
            groups: {
                select: {
                    id: true,
                    _count: {
                        select: {
                            credits: true
                        }
                    }
                }
            }
        }

        return await base.findOne({ id }, select, true);
    }

    async function findLastGroup(id: number) {
        return await base.findOne({id}, {
            groups: {
                select: { id: true, name: true },
                orderBy: { name: 'desc' },
                take: 1
            }
        }, true);
    }

    async function deleteOne(id: number) {
        return await base.deleteOne({ id });
    }

    async function createOne(townId: number, routeId: number, consecutive: number, name: string) {
        return await base.createOne({
            townId,
            routeId,
            consecutive,
            name
        })
    }

    return { 
        base,
        findLastConsecutive,
        findAll,
        findOne,
        findAutocomplete,
        findCountGroups,
        findLastGroup,
        updateOne,
        deleteOne,
        createOne
     }
}