import { BaseUserI, CreateUserI, PaginationWithFilters, UpdateUserI, UserRepositoryI } from "~/.server/domain/interface";


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

    async function updateOne(id: number, user: UpdateUserI) {
        return await base.updateOne({ id }, user);
    }

    async function updatePassword(id: number, password: string) {
        return await base.updateOne({ id }, { password });
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
        updateOne,
        updatePassword,
        base
    };
}