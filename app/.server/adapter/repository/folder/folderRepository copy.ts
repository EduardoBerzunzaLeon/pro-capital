import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { db } from "../../db";
import { baseRepository } from "../base.repository";
import { FolderRepositoryI, PaginationProps } from "~/.server/domain/interface";

export function FolderRepository() : FolderRepositoryI {

    const base = baseRepository(db.folder);

    async function findLastConsecutive( townId: number ) {

        const data = await base.entity.aggregate({
            where: { townId },
            _max: { consecutive: true }
        });

        const { consecutive  } = data._max;

        return consecutive ?? 0;
    }

    async function findAll( paginationData: PaginationWithFilters ) {
        return await base.findManyPaginator({ paginatonWithFilter: paginationData }); 
    }

    return { 
        base,
        findLastConsecutive,
        findAll
     }
}