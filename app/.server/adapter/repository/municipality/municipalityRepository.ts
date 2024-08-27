import { MunicipalityRepositoryI } from "~/.server/domain/interface";
import { db } from "../../db";
import { baseRepository } from "../base.repository";
import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";

export function MunicipalityRepository():  MunicipalityRepositoryI {

    const base = baseRepository(db.municipality);

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
            }
        })
    }

    async function findOne(id: number) {
        return await base.findOne({ id }, { id: true, name: true }, true);
    }

    async function findIfHasTowns(id: number) {
        return await base.findOne({id}, {
            name: true,
            _count: {
                select: {
                    towns: true
                }
            }
        });
    }

    async function findIfExists(name: string) {
        return await base.findOne({ name }, {id: true}, true);
    }

    async function deleteOne(id: number) {
        return await base.deleteOne({ id });
    }   

    async function updateOne(id: number, name: string) {
        return await base.updateOne({ id }, { name });
    }

    async function createOne(name: string) {
        return await base.createOne({ name });
    }

    return { 
        findAll,
        findOne,
        findAutocomplete,
        findIfHasTowns,
        findIfExists,
        deleteOne,
        updateOne,
        createOne,
        base
    };
} 