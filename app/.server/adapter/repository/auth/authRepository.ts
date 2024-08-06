import { User } from "~/.server/domain/entity";
import type { AuthRepositoryI } from "~/.server/domain/interface";
import { db } from "~/utils/db.server";

export function AuthRepository(): AuthRepositoryI {
    async function login(userName?: string, password?: string) {

        const userDb = await db.user.findFirst({where: { userName , password}});
        if(!userDb) throw new Error('user not found');
        const user = new User(userDb);

        return user;
    }

    return { login };
} 