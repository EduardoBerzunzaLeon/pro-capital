import { BaseTownI, PaginationWithFilters, TownRepositoryI, UpdateTownProps } from "~/.server/domain/interface";

export function TownRepository(base: BaseTownI): TownRepositoryI {
    
    async function findAutocomplete(name: string)  {
        return await base.findMany({
            searchParams: { name: { contains: name }},
            select: { id: true, name: true }
        });
    }

    async function findAll(paginationData: PaginationWithFilters) {
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                name: true,
                municipality: {
                    select: {
                        id: true,
                        name: true,
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
                municipality: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    }

    async function findOne(id: number) {
        return await base.findOne({ id }, {
            id: true,
            name: true,
            municipality: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }, true);
    } 

    async function findIfExists(name: string) {
        return await base.findOne({ name }, { id: true }, true);
    }

    async function findIfHasFolders(id: number) {
        return await base.findOne({id}, 
            {
                name: true,
                _count: {
                    select: {
                        folders: true
                    }
                }
            }
        );
    }

    async function createOne(name: string, municipalityId: number) {
        return await base.createOne({ municipalityId, name });
    } 
    
    async function deleteOne(id: number) {
        return await base.deleteOne({ id });
    }

    async function updateOne(id: number, { name, municipalityId }: UpdateTownProps) {
        return await base.updateOne({id}, { name, municipalityId });
    } 
    
    return {
        findAll,
        findOne,
        deleteOne,
        updateOne,
        createOne,
        findIfHasFolders,
        findIfExists,
        findByReport,
        findAutocomplete,
        base
    }

}