import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';
import { Generic } from '~/.server/interfaces';

export interface CreateLeaderProps{
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    fullname: string,
    curp: string, 
    address: string,
    birthday: Date,
    anniversaryDate: Date,
    folderId: number,
    createdById: number,
}

export interface UpdateLeaderProps{
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    fullname: string,
    curp: string, 
    address: string,
    birthday: Date,
    anniversaryDate: Date,
    folderId: number,
}

export interface FindBirthdayProps {
    month: number,
    day: number,
    limit: number,
    offset: number
}

export type FindReportBirthdayProps = Pick<FindBirthdayProps, 'month' | 'day'>;

export type BaseLeaderI = BaseRepositoryI<
    Prisma.LeaderDelegate, 
    Prisma.LeaderWhereInput, 
    Prisma.LeaderSelect,
    Prisma.XOR<Prisma.LeaderUpdateInput, Prisma.LeaderUncheckedUpdateInput>,
    Prisma.XOR<Prisma.LeaderCreateInput, Prisma.LeaderUncheckedCreateInput>,
    Prisma.LeaderOrderByWithRelationInput | Prisma.LeaderOrderByWithRelationInput[]
>;

export interface LeaderRepositoryI{
    base: BaseLeaderI
    createOne: (props: CreateLeaderProps) => Promise<Generic | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>,
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findAllBirthday: (props: FindBirthdayProps) => Promise<unknown>
    findByReport: (paginationData: PaginationWithFilters ) => Promise<Generic[] | undefined>,
    findCountBirthdays: (month: number, day: number) => Promise<{times: number}[]>,
    findIfHasFolder: (folderId: number) => Promise<Generic | undefined>,
    findIfHasOtherLeader: (folderId: number, leaderId: number) => Promise<Generic | undefined>,
    findReportAllBirthday: (props: FindReportBirthdayProps) => Promise<unknown>,
    findIfHasOwnFolder: (folderId: number, leaderId: number) => Promise<Generic | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>,
    resubscribe: (id: number, folderId: number) => Promise<Generic | undefined>,
    unsubscribe: (id: number, date: Date, reason?: string) => Promise<Generic | undefined>,
    updateOne: (id: number, props: UpdateLeaderProps) => Promise<Generic | undefined>,
}