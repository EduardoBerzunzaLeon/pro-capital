import { User } from "~/.server/domain/entity";
import type { AuthRepositoryI } from "~/.server/domain/interface";
import { ServerError } from "~/.server/errors";
import { db } from "../../db";

export function AuthRepository(): AuthRepositoryI {
    async function findByUserName(userName: string) {

        const userDb = await db.user.findUnique({ where: { username: userName }});
    
        if (!userDb) {
            throw ServerError.badRequest('Credenciales Incorrectas');
        }
    
        return new User(userDb);
    }

    return { findByUserName };
} 