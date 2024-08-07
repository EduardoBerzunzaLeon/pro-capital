import { User } from "../entity";

export interface AuthRepositoryI {
    findByUserName: (userName: string) => Promise<User>
}