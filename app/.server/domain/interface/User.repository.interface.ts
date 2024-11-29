import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';

export type SexI = 'masculino' | 'femenino';

export interface CreateUserI {
    email: string,
    username: string,
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    fullName: string,
    password: string,
    roleId: number,
    address: string,
    sex: SexI,
}

export type UpdateRole = Pick<CreateUserI, 'roleId'>;
export type UpdatePersonalData = Omit<CreateUserI, 'roleId'>;

export type BaseUserI = BaseRepositoryI<
    Prisma.UserDelegate, 
    Prisma.UserWhereInput, 
    Prisma.UserSelect,
    Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>,
    Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
    Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
>;


export interface UserRepositoryI {
    findAll: (paginationData: PaginationWithFilters) => Promise<ResponseWithMetadata>,
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findRole: (id: number) => Promise<Generic | undefined>,
    updateIsActive: (id: number, isActive: boolean) => Promise<Generic | undefined>,
    createOne: (user: CreateUserI) => Promise<Generic | undefined>,
    updatePersonalData: (id: number, user: UpdatePersonalData) => Promise<Generic | undefined>,
    updatePassword: (id: number, password: string) => Promise<Generic | undefined>,
    updateRole: (id: number, roleId: number) => Promise<Generic | undefined>,
    updateAvatar: (id: number, avatar: string) => Promise<Generic | undefined>,
    base: BaseUserI
}

