import { BaseUserI, CreateUserI, PaginationWithFilters, UpdatePersonalData, UserRepositoryI } from "~/.server/domain/interface";


export function UserRepository(base: BaseUserI) : UserRepositoryI {

    async function findAll(paginationData: PaginationWithFilters) {
        return base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                isActive: true,
                role: {
                    select: {
                        role: true
                    }
                },
                address: true,
                sex: true,
                avatar: true,
            }
        })
    }

    async function findOne(id: number) {
        return await base.findOne({ id }, { 
            id: true,
            email: true,
            username: true,
            name: true,
            lastNameFirst: true,
            lastNameSecond: true,
            fullName: true,
            isActive: true,
            role: {
                select: {
                    id: true,
                    role: true
                }
            },
            address: true,
            sex: true,
            avatar: true,
        })
    }

    async function findRole(id: number) {
        return await base.findOne({ id }, { id: true, role: true });
    }

    async function updateIsActive(id: number, isActive: boolean) {
        return await base.updateOne({ id }, { isActive: isActive });
    }

    async function createOne (user: CreateUserI) {
        return await base.createOne(user);
    }

    async function updatePersonalData(id: number, user: UpdatePersonalData) {
        return await base.updateOne({ id }, user);
    }

    async function updatePassword(id: number, password: string) {
        return await base.updateOne({ id }, { password });
    }

    async function updateRole(id: number, roleId: number) {
        return await base.updateOne({id}, { roleId });
    }

    async function updateAvatar(id: number, avatar: string) {
        return await base.updateOne({id}, { avatar });
    }

    async function findAutocomplete(name: string) {
        return await base.findMany({
            searchParams: { 
                name: { contains: name },      
                role: { role: { in: ['ADMIN', 'ASESOR'] } }
            },
            select: { id: true, fullName: true }
        })
    }

    return {
        findAll,
        findAutocomplete,
        findOne,
        findRole,
        updateIsActive,
        createOne,
        updatePersonalData,
        updatePassword,
        updateRole,
        updateAvatar,
        base
    };
}