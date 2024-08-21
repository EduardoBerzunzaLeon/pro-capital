import { FolderRepositoryI } from "~/.server/domain/interface";
import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { db } from "../../db";
import { ServerError } from "~/.server/errors";
import { Folder } from "~/.server/domain/entity";
import { groups } from '../../../../../prisma/users';

type SortOrder = 'asc' | 'desc';

export function FolderRepository() : FolderRepositoryI {

    async function findAll({ page, limit, column, direction, search }: PaginationWithFilters) {

        const directionBy: SortOrder = direction === 'ascending' ? 'asc' : 'desc';

        let orderBy = {};

        if(column === 'name')
            orderBy = { [column]: directionBy };
        if(column === 'town') {
            orderBy = { town: { name: directionBy} }
        }
       
        if(column === 'municipality') {
            orderBy = { town: { municipality: {name: directionBy } }}
        }

          let whereClause = null;

          if(search.length > 0) {
               whereClause = search.reduce((acc, { column, value }) => {
  
                  if(value === '')
                      return acc;
  
                  const testArray = column.split('.');
                  
  
                      if(testArray.length === 2 ) {
                          acc.where = {
                              ...acc.where,
                              [testArray[0]] : {
                                  [testArray[1]]: {
                                      contains: value
                                  }
                              }
                              
                          }
                          return acc;
                      } 
  
  
                    if(testArray.length === 3) {
                        acc.where = {
                            ...acc.where,
                            [testArray[0]] : {
                                [testArray[1]]: {
                                    [testArray[2]] :{
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
        

        const foldersDb = await db.folder.findMany({
            ...whereClause,
            skip: (page - 1) * limit, 
            take: limit,  
            orderBy: orderBy,
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

        

        const total = await db.folder.count();

        const pageCount = Math.ceil(total / limit);
        const nextPage = page < pageCount ? page + 1: null;

        if (total === 0) {
            throw ServerError.notFound('No se encontraron localidades');
        }
    
        const folders =  Folder.mapper(foldersDb);
        return {
            data: folders,
            total,
            pageCount,
            nextPage,
            currentPage: page
        }
    }

    return {
        findAll
    }
}