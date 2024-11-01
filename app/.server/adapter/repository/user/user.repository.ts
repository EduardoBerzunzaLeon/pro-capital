import { BaseUserI, UserRepositoryI } from "~/.server/domain/interface";


export function UserRepository(base: BaseUserI) : UserRepositoryI {


    async function findAutocomplete(name: string) {
        return await base.findMany({
            searchParams: { 
                name: { contains: name },      
                role: { role: { in: ['ADMIN', 'AGENT'] } }
            },
            select: { id: true, fullName: true }
        })
    }

    return {
        findAutocomplete,
        base
    };
}