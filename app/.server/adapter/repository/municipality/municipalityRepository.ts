import { db } from "../../db";
import { ServerError } from "~/.server/errors";
import { MunicipalityRepositoryI } from "~/.server/domain/interface";
import { Municipality } from "~/.server/domain/entity";
import { PaginationProps } from "../pagination/pagination.interface";

export function MunicipalityRepository(): MunicipalityRepositoryI {
    async function findAll({ page, limit, column, direction }: PaginationProps) {

        const directionBy = direction === 'ascending' ? 'asc' : 'desc';
        const municipalitiesDb = await db.municipality.findMany(
            { 
                skip: (page - 1) * limit, 
                take: limit,  
                orderBy: { [column]: directionBy }
            },
        );
    
        const total = await db.municipality.count();

        const pageCount = Math.ceil(total / limit);
        const nextPage = page < pageCount ? page + 1: null;

        if (total === 0) {
            throw ServerError.notFound('No se encontraron municipios');
        }
    
        const municipalities =  Municipality.mapper(municipalitiesDb);
        return {
            data: municipalities,
            total,
            pageCount,
            nextPage,
            currentPage: page
        }
    }

    async function findOne(id: number) {

        const municipalityDb = await db.municipality.findUnique({ where: { id } });

        if (!municipalityDb) {
            throw ServerError.notFound(`No se encontro el municipio con ID: ${id}`);
        }

        return Municipality.create(municipalityDb);
    }

    async function deleteOne(id: number) {
        const municipalityDb = await db.municipality.findUnique({
            where: { id },
            select: {
                name: true,
                _count: {
                    select: {
                        towns: true
                    }
                }
            }
        });
        
        if(!municipalityDb) {
            throw ServerError.notFound(`No se encontro el municipio con ID: ${id}`);
        }
        
        const townsCount = municipalityDb._count.towns;
        if(townsCount > 0) {
            throw ServerError.badRequest(
                `El municipio de ${municipalityDb.name} tiene ${townsCount} localidades`
            );
        }

        const municipalityDeleted = await db.municipality.delete({ where: { id } });

        if(!municipalityDeleted) 
            throw ServerError.internalServer(`No se pudo eliminar el municipio ${municipalityDb.name}`);
        
    }   

    async function updateOne(id: number, name: string) {
        const  municipalityUpdated = await db.municipality.update({
            where: { id },
            data: { name }
        });

        if(!municipalityUpdated) 
            throw ServerError.badRequest(`No se pudo actualizar el municipio con ID: ${id}`);

    }


    async function createOne(name: string) {
        const municipalityDb = await db.municipality.findUnique({ where: { name } });
        if(municipalityDb) {
            throw ServerError.badRequest(`El municipio con nombre: ${name} ya existe`);
        }
        
        const newMunicipality = await db.municipality.create({ data: { name }} );
        
        if(!newMunicipality) {
            throw ServerError.internalServer(`No se pudo crear el municipio ${name}, intentelo mas tarde`);
        }

        return Municipality.create(newMunicipality);
    }

    return { 
        findAll,
        findOne,
        deleteOne,
        updateOne,
        createOne
    };
} 