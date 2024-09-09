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


export type BaseLeaderI = BaseRepositoryI<
    Prisma.LeaderDelegate, 
    Prisma.LeaderWhereInput, 
    Prisma.LeaderSelect,
    Prisma.XOR<Prisma.LeaderUpdateInput, Prisma.LeaderUncheckedUpdateInput>,
    Prisma.XOR<Prisma.LeaderCreateInput, Prisma.LeaderUncheckedCreateInput>
>;


export interface LeaderRepositoryI{
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    base: BaseLeaderI
    findOne: (id: number) => Promise<Generic | undefined>,
    createOne: (props: CreateLeaderProps) => Promise<Generic | undefined>,
    findIfHasFolder: (folderId: number) => Promise<Generic | undefined>,
    findIfHasOwnFolder: (folderId: number, leaderId: number) => Promise<Generic | undefined>,
    findAllBirthday: (month: number, day: number) => Promise<Generic[] | undefined>
    deleteOne: (id: number) => Promise<Generic | undefined>,
    updateOne: (id: number, props: UpdateLeaderProps) => Promise<Generic | undefined>,
    unsubscribe: (id: number, date: Date, reason?: string) => Promise<Generic | undefined>,
    resubscribe: (id: number, folderId: number) => Promise<Generic | undefined>,
}

