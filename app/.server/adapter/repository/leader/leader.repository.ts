import { BaseLeaderI, CreateLeaderProps, LeaderRepositoryI, PaginationWithFilters, UpdateLeaderProps } from "~/.server/domain/interface";
import { db } from "../../db";
import { Generic } from "~/.server/interfaces";


export function LeaderRepository(base: BaseLeaderI): LeaderRepositoryI {

    async function findAll(paginationData: PaginationWithFilters) {

        // const data = await db.leader.findMany({
        //     where: {
        //        birthday: {
        //            getDate(): {
        //             readonly: true
        //            }
   
        //        }
        //     }
        //    })
   
        //    console.log({data});

           
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                fullname: true,
                curp: true,
                address: true,
                birthday: true,
                folder: {
                    select: {
                        name: true,
                    }
                },
                isActive: true
            }
        })
    }

    async function findOne(id: number) {
        return await  base.findOne(
            { 
                id,
            }, 
            {
                id: true,
                name: true,
                lastNameFirst: true,
                lastNameSecond: true,
                curp: true,
                address: true,
                birthday: true,
                anniversaryDate: true,
                folder: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }, 
            true
        )
    }

    async function createOne(props: CreateLeaderProps) {
        return await base.createOne({...props})
    }

    async function findIfHasFolder(folderId: number) {
        return await base.findOne({
            isActive: true,
            folderId
        }, { name: true, id: true });
    }

    async function findIfHasOwnFolder(folderId: number, leaderId: number) {
        return await base.findOne({
            isActive: true,
            folderId,
            id: { not: leaderId }
        }, { name: true, id: true });
    }

    async function deleteOne( id: number) {
        return await base.deleteOne({ id });
    } 

    async function updateOne(id: number, props: UpdateLeaderProps) {
        return await base.updateOne({ id }, {...props});
    }

    // TODO: add folder name in query
    async function findAllBirthday(month: number, day: number): Promise<Generic[] | undefined> {
    
        return db
          .$queryRaw`SELECT fullname, address, folderId FROM "Leader" WHERE EXTRACT(MONTH FROM "birthday") = ${month} AND EXTRACT(DAY FROM "birthday") = ${day} AND "isActive" = true`;
    }

    async function unsubscribe(id: number, date: Date, reason?: string) {
        return await base.updateOne({ 
            id,
            anniversaryDate: { lte: date }
         }, {
            unsubscribeDate: date,
            isActive: false,
            unsubscribeReason: reason
        });
    }

    async function resubscribe(id: number, folderId: number) {        
        return await base.updateOne({ id }, {
            folderId,
            isActive: true,
            unsubscribeReason: ''
        });
    }
    
    return  {
        findAll,
        findOne,
        createOne,
        findIfHasFolder,
        findIfHasOwnFolder,
        findAllBirthday,
        deleteOne,
        updateOne,
        unsubscribe,
        resubscribe,
        base
    }

}