import { RoleTypes } from "@prisma/client";
import { SexI } from "../interface";
import { ServerError } from "~/.server/errors";

export interface UserI {
    id: number,
    email: string,
    username: string,
    fullName: string,
    isActive: boolean,
    role: {
        role: RoleTypes,
    },
    address: string,
    sex: SexI,
    avatar?: string
}

export class UserComplete {

    public readonly id: number;
    public readonly email: string;
    public readonly username: string;
    public readonly fullName: string;
    public readonly isActive: boolean;
    public readonly role: RoleTypes;
    public readonly address: string;
    public readonly sex: SexI;
    public readonly avatar?: string;
    
    private constructor({
        id,
        email,
        username,
        fullName,
        isActive,
        role,
        address,
        sex,
        avatar,
    }: UserComplete ){
        this.id = id;
        this.email = email;
        this.username = username;
        this.fullName = fullName;
        this.isActive = isActive;
        this.role = role;
        this.address = address;
        this.sex = sex;
        this.avatar = avatar;
    }

    static mapper(users: Partial<UserI>[]) {
        return users.map(UserComplete.create);
    }

    static create(user: Partial<UserI>) {
        const  {
            id,
            email,
            username,
            fullName,
            isActive,
            role,
            address,
            sex,
            avatar,
        } = user;

        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(!email) throw ServerError.badRequest('El correo es requerido');
        if(!username) throw ServerError.badRequest('El nombre de usuario es requerido');
        if(!fullName) throw ServerError.badRequest('El nombre completo es requerido');
        if(typeof isActive === 'undefined') throw ServerError.badRequest('El estatus es requerido');
        if(!role || !role.role) throw ServerError.badRequest('El role es requerido');
        if(!address) throw ServerError.badRequest('La dirección es requerido');
        if(!sex) throw ServerError.badRequest('El sexo es requerido');
        
        return new UserComplete({
            id,
            email,
            username,
            fullName,
            isActive,
            role: role.role,
            address,
            sex,
            avatar,
        })


    } 

}