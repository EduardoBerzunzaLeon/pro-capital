import { FolderRepositoryI } from "~/.server/domain/interface";
import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { db } from "../../db";
import { ServerError } from "~/.server/errors";
import { Folder } from "~/.server/domain/entity";
import { folders } from '../../../../../prisma/users';

type SortOrder = 'asc' | 'desc';

interface CreateFolderProps { 
    consecutive: number, 
    name: string, 
    townId: number, 
    routeId: number
}


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

        const total = await db.folder.count({...whereClause});

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

    async function findOne(id: number) {

        const folder = await db.folder.findUnique({ 
            where: {id},
            select: {
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
        });

        if(!folder) throw ServerError.notFound('No se encontro la carpeta');

        // TODO: change the mapper, it needs add id in route, municipality, leader
        return folder;
    }

    async function updateOne(id:number, routeId: number) {
        await findOne(id);

        const folder = await db.folder.update({
            where: { id },
            data: { routeId }
        });

        if(!folder) {
            throw ServerError.badRequest(`No se pudo actualizar carpeta`);
        }
    }

    async function deleteOne(id: number) {
        const folderDb = await db.folder.findUnique({
            where: { id },
            select: {
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
                                credit: true
                            }
                        }
                    }
                }
            }
        });

        if(!folderDb) {
            throw ServerError.notFound('No se encontro la carpeta');
        }

        if(folderDb._count.groups > 0) {
            let hasCredit = false;
    
            for (let index = 0; index < folderDb.groups.length; index++) {
                if(folderDb.groups[index]._count.credit) {
                    hasCredit = true;
                    break;
                }
            }
    
            if(hasCredit) {
                throw ServerError.badRequest(`La carpeta ${folderDb.name} tiene creditos asignados a uno o varios grupos`);
            }
    
            const groupsId = folderDb.groups.map(({id}) => id);
    
            const groupsDeleted = await db.group.deleteMany({
                where: { id: {
                    in: groupsId
                }}
            });
    
            if(groupsDeleted.count < 0) {
                throw ServerError.internalServer('Ocurrio un error, no se pudo eliminar los grupos de la carpeta')
            }
        }

        const folderDeleted = await db.folder.delete({ where: { id }});

        if(!folderDeleted) 
            throw ServerError.internalServer('No se pudo eliminar la carpeta')

    }

    async function findNextConsecutive(townId: number) {

        const data = await db.town.findUnique(
            {
            where: { id: townId },
            select: {
                name: true,
                _count: {
                    select: {
                        folders: true
                    }
                },
            }
        })

        if(!data) {
            throw ServerError.badRequest('No se encontro la localidad');
        }

        return data._count.folders + 1;


    }

    async function createOne({ consecutive, name, townId, routeId }: CreateFolderProps) {

        const [town, route] = await Promise.all([
            db.town.findUnique({ where: {id: townId }}),
            db.route.findUnique({ where: { id: routeId }})
        ]);

        if(!town || !route) {
            throw ServerError.badRequest('No existe la carpeta ni/o el municipio');
        }

        const newFolder = await db.folder.create({
            data: { consecutive, name, routeId, townId }
        });

        if(!newFolder) 
            throw ServerError.internalServer('No se pudo crear la carpeta');

        const group = await db.group.create({
            data: { name: 1, folderId: newFolder.id }
        });

        if(!group){
            await db.folder.delete({ where: { id: newFolder.id }});
            throw ServerError.internalServer(`No se pudo crear automaticamente el grupo de la carpeta ${newFolder.name}`)
        }
    }

    return {
        findAll,
        findOne,
        updateOne,
        deleteOne,
        createOne
    }
}