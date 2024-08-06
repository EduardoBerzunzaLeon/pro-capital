import { User } from "~/.server/domain/entity";
import type { AuthRepositoryI } from "~/.server/domain/interface";
import { db } from "~/utils/db.server";
import bcrypt from 'bcryptjs';

export function AuthRepository(): AuthRepositoryI {
    async function login(userName?: string, password?: string) {

        if(!userName || !password ) throw new Error('Incomplete data login');

        const userDb = await db.user.findUnique({ where: { userName }});
    
        if (!userDb || !( await bcrypt.compare(password, userDb.password))) {
            throw new Error('Credencials Incorrect');
        }
    
        const user = new User(userDb);
        return user;
    }

    return { login };
} 