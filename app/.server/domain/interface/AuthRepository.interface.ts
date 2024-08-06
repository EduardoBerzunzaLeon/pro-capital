import { User } from "../entity";

export interface AuthRepositoryI {
    login: (userName?: string, password?: string) => Promise<User>
}