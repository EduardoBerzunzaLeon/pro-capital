
import { TownRepositoryI, UpdateTownProps } from "~/.server/domain/interface";
import { db } from "../../db";
import { ServerError } from "~/.server/errors";
import { Town } from "~/.server/domain/entity/town.entity";
import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { Repository } from "..";

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
        const town = await db.town.findUnique({ 
            where: { id },
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

        if(!town) throw ServerError.notFound('No se encontro la localidad');

        return Town.create(town);

    } 

    async function createOne(name: string, municipalityId: number) {

        await Repository.municipality.findOne(municipalityId);

        const town = await db.town.findUnique({ where: {name}});

        if(town) {
            throw ServerError.badRequest('La localidad ya existe');
        }

        const newTown = await db.town.create({ data:  { municipalityId, name}});

        if(!newTown) {
            throw ServerError.internalServer(`No se pudo crear la localidad ${name}, intentelo mas tarde`)
        }

        return Town.create(newTown);
    } 
    
    async function deleteOne(id: number) {
        const townDb = await db.town.findUnique({
            where: { id },
            select: {
                name: true,
                _count: {
                    select: {
                        folders: true
                    }
                }
            }
        });
        
        if(!townDb) {
            throw ServerError.notFound(`No se encontro el municipio con ID: ${id}`);
        }
        
        const townsCount = townDb._count.folders;
        if(townsCount > 0) {
            throw ServerError.badRequest(
                `El municipio de ${townDb.name} tiene ${townsCount} localidades`
            );
        }

        const townDeleted = await db.town.delete({ where: { id } });

        if(!townDeleted) 
            throw ServerError.internalServer(`No se pudo eliminar el municipio ${townDb.name}`);
    }

    async function updateOne(id: number, { name, municipalityId }: UpdateTownProps) {
        const municipality = await db.municipality.findUnique({ where: { id: municipalityId }});

        if(!municipality) throw ServerError.notFound('El municipio solicitado no existe');

        const town = await db.town.update({
            where: { id },
            data: { name, municipalityId}
        });

        if(!town) throw ServerError.badRequest(`No se pudo actualizar la localidad con el nombre ${name}`);

    } 
    
    return {
        findAll,
        findOne,
        deleteOne,
        updateOne,
        createOne,
    }

}