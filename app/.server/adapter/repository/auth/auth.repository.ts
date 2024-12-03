import type { AuthRepositoryI, BaseAuthI } from "~/.server/domain/interface";

export function AuthRepository(base: BaseAuthI): AuthRepositoryI {
    async function findByUserName(username: string) {
        return await base.findOne({ 
            username,
            isActive: true 
        }, { 
            id: true,
            password: true,
            avatar: true,
            email: true,
            username: true,
            name: true,
            lastNameFirst: true,
            lastNameSecond: true,
            fullName: true,
            role: {
                select: {
                    id: false,
                    role: true,
                    permissions: { select: { 
                        servername: true,
                        id: false,
                        name: false,
                        description: false,
                        module: false,
                        roles: false, 
                    } }
                }
            }
        })
    }

    return { findByUserName, base };
} 