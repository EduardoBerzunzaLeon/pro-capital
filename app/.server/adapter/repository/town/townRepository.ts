
import { PaginationProps, TownRepositoryI, UpdateTownProps } from "~/.server/domain/interface";
import { db } from "../../db";
import { ServerError } from "~/.server/errors";
import { Town } from "~/.server/domain/entity/town.entity";
import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";

type SortOrder = 'asc' | 'desc';

export function TownRepository(): TownRepositoryI {

    async function findAll({ page, limit, column, direction, search }: PaginationWithFilters) {

        const directionBy: SortOrder = direction === 'ascending' ? 'asc' : 'desc';

        const orderBy = column !== 'municipality' 
            ? { [column]: directionBy }
            : {
                municipality: {
                  name: directionBy,
                },
              };

        let whereClause = null;

        if(search.length > 0) {
             whereClause = search.reduce((acc, { column, value }) => {

                if(value === '')
                    return acc;

                if(column === 'municipality') {
                    const test = 'municipality.name';
                    const testArray = test.split('.');

                    if(testArray.length > 1 ) {
                        acc.where = {
                            ...acc.where,
                            // municipality: {
                            //     name: {
                            //         contains: value
                            //     }
                            // }
                            [testArray[0]] : {
                                [testArray[1]]: {
                                    contains: value
                                }
                            }
                            
                        }
                    } 

                    return acc;
                }

                acc.where = {
                    ...acc.where,
                    [column]: {
                        contains: value
                    }
                }

                return acc;

            }, { where: {} });
        }

        const townsDb = await db.town.findMany({
            ...whereClause,
            skip: (page - 1) * limit, 
            take: limit,  
            orderBy: orderBy,
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
        });

        console.log(townsDb);

        const total = await db.town.count({...whereClause});

        const pageCount = Math.ceil(total / limit);
        const nextPage = page < pageCount ? page + 1: null;

        if (total === 0) {
            throw ServerError.notFound('No se encontraron localidades');
        }
    
        const towns =  Town.mapper(townsDb);
        return {
            data: towns,
            total,
            pageCount,
            nextPage,
            currentPage: page
        }

    }

    async function findOne(id: number) {
        throw new Error('Not implemented');
    } 

    async function createOne(name: string, municipalityId: number) {
        throw new Error('Not implemented');
    } 
    
    async function deleteOne(id: number) {
        throw new Error('Not implemented');
    }

    async function updateOne(id: number, { name, municipalityId }: UpdateTownProps) {
        throw new Error('Not implemented');
    } 
    
    return {
        findAll,
        findOne,
        deleteOne,
        updateOne,
        createOne,
    }

}