import { RoleTypes } from "@prisma/client";

export interface UserI {
    id: number,
    email: string,
    name: string,
    lastNameFirst: string,
    username: string,
    password: string,
    role: {
        id: number,
        role: RoleTypes,
        permissions: {
            servername: string
        } []
    },
    lastNameSecond: string | null,
    avatar?: string,
}

export class User {

    readonly id: number;
    readonly email: string;
    readonly name: string;
    readonly lastNameFirst: string;
    readonly username: string;
    readonly password: string;
    readonly role: RoleTypes;
    readonly permissions: { servername: string }[];
    readonly avatar?: string;
    readonly lastNameSecond?: string;

    constructor({
        id,
        email,
        name,
        lastNameFirst,
        username,
        password,
        role,
        avatar,
        lastNameSecond,
    }: UserI){
        this.id = id;
        this.email = email;
        this.name = name;
        this.lastNameFirst = lastNameFirst;
        this.username = username;
        this.password = password;
        this.role = role.role;
        this.permissions = role.permissions,
        this.avatar = avatar;
        this.lastNameSecond = this.validateLastNameLast(lastNameSecond);
    }

    private validateLastNameLast(lastNameLast: string | null) {
        return lastNameLast || undefined
    }

}