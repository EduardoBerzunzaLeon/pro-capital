import { BaseLeaderI, CreateLeaderProps, FindBirthdayProps, LeaderRepositoryI, PaginationWithFilters, UpdateLeaderProps } from "~/.server/domain/interface";
import { db } from "../../db";


export function LeaderRepository(base: BaseLeaderI): LeaderRepositoryI {

    async function findAll(paginationData: PaginationWithFilters) {

        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                fullname: true,
                curp: true,
                address: true,
                anniversaryDate: true,
                folder: {
                    select: {
                        name: true,
                    }
                },
                isActive: true
            }
        })
    }

    async function findByReport(paginationData: PaginationWithFilters) {
        return await base.findManyByReportExcel({
            paginatonWithFilter: paginationData,
            select: {
                fullname: true,
                curp: true,
                address: true,
                anniversaryDate: true,
                birthday: true,
                folder: {
                    select: {
                        name: true,
                    }
                },
                isActive: true,
                createdAt: true,
                createdBy: {
                    select: {
                        fullName: true
                    }
                }
            }
        })
    }

    async function findOne(id: number) {
        return await base.findOne(
            { id }, 
            {
                id: true,
                name: true,
                lastNameFirst: true,
                lastNameSecond: true,
                fullname: true,
                curp: true,
                address: true,
                birthday: true,
                anniversaryDate: true,
                isActive: true,
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
        }, { name: true, id: true, folderId: true, folder: true });
    }

    async function findIfHasOwnFolder(folderId: number, leaderId: number) {
        return await base.findOne({
            isActive: true,
            folderId,
            id: leaderId 
        }, { name: true, id: true, folder: true });
    }
    
    async function findIfHasOtherLeader(folderId: number, leaderId: number) {
        return await base.findOne({
            isActive: true,
            folderId,
            id: { not: leaderId } 
        }, { name: true, id: true, folder: true });
    }

    async function deleteOne( id: number) {
        return await base.deleteOne({ id });
    } 

    async function updateOne(id: number, props: UpdateLeaderProps) {
        return await base.updateOne({ id }, {...props});
    }

    async function findAllBirthday({ month, day, limit, offset }: FindBirthdayProps) {    
        // -- const likeName = 'and "fullname" like '%fat%'';
        return await db
          .$queryRaw`SELECT
          a."id",
          a."fullname",
          b."name" as folder,
          a."birthday",
          a."address"
      FROM
          "Leader" as a
       LEFT JOIN "Folder" as b on b.id = a."folderId"
       WHERE
          EXTRACT(
              MONTH
              FROM
                  "birthday"
          ) = ${month}
          AND EXTRACT(
              DAY
              FROM
                  "birthday"
          ) = ${day}
          AND a."isActive" = true AND b."isActive" = true
          order by b."name", a."fullname"
      LIMIT
          ${limit} offset ${offset}`;

    }

    async function findCountBirthdays(month: number, day: number) {
        return await db.$queryRaw<{times: number}[]>`
        SELECT
            count(*) as times
        FROM
            "Leader" as a
        LEFT JOIN "Folder" as b on b.id = a."folderId"
        WHERE
            EXTRACT(
                MONTH
                FROM
                    "birthday"
            ) = ${month}
            AND EXTRACT(
                DAY
                FROM
                    "birthday"
            ) = ${day}
            AND a."isActive" = true AND b."isActive" = true`;
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
        findByReport,
        findOne,
        createOne,
        findIfHasFolder,
        findIfHasOwnFolder,
        findIfHasOtherLeader,
        findAllBirthday,
        findCountBirthdays,
        deleteOne,
        updateOne,
        unsubscribe,
        resubscribe,
        base
    }

}