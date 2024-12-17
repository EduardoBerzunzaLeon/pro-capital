import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { BaseFolderI, CreateFolderI, FolderRepositoryI } from "~/.server/domain/interface";

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

    async function findSampleAll() {
        return await base.findMany({
            select: { id: true, name: true },
            take: 10000
        });
    }

    async function findByReport(paginationData: PaginationWithFilters) {
        return await base.findManyByReportExcel({
            paginatonWithFilter: paginationData,
            select: {
                name: true,
                createdAt: true,
                createdBy: {
                    select: {
                        fullName: true
                    }
                },
                town: {
                    select: {
                        name: true,
                        municipality: {
                            select: { name: true }
                        }
                    }
                },
                route: { select: { name: true } },
                leaders: {
                    where: {
                        isActive: true
                    },
                    select: {
                        fullname: true
                    },
                    take: 1
                },
                _count: {
                    select: {
                        groups: true
                    }
                }
            }
        })
    }

    async function findAll( paginationData: PaginationWithFilters ) {
        return await base.findManyPaginator({
                paginatonWithFilter: paginationData,
                select: {
                    id: true,
                    name: true,
                    isActive: true,
                    town: {
                        select: {
                            name: true,
                            municipality: {
                                select: { name: true }
                            }
                        }
                    },
                    route: { select: { name: true } },
                    leaders: {
                        where: {
                            isActive: true
                        },
                        select: {
                            name: true,
                            lastNameFirst: true,
                            lastNameSecond: true,
                            isActive: true,
                        },
                        take: 1
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

    async function findByNameAndGroup(name: string, group: number) {
        
        const select = {
            id: true,
            name: true,
            groups: {
                where: {
                    name: group
                }
            }
        }

        return await base.findOne({ name }, select, true);
    }



    async function updateOne(id: number, routeId: number) {
        return await base.updateOne({ id }, { routeId });
    }

    async function updateIsActive(id: number, isActive: boolean) {
        return await base.updateOne({ id }, { isActive });
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

    async function createOne(data: CreateFolderI) {
        return await base.createOne(data)
    }

    return { 
        base,
        findLastConsecutive,
        findAll,
        findOne,
        findAutocomplete,
        findCountGroups,
        findByNameAndGroup,
        findByReport,
        findLastGroup,
        updateIsActive,
        findSampleAll,
        updateOne,
        deleteOne,
        createOne
     }
}