import { BaseRoleI, RoleRepositoryI } from "~/.server/domain/interface";


export function RoleRepository(base: BaseRoleI): RoleRepositoryI {
    async function findMany() {
        return await base.findMany({
            select: {
                role: true,
                id: true
            },
            take: 100
        })
    }

    return {
        findMany,
        base
    }
}