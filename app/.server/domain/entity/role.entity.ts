import { ServerError } from "~/.server/errors";


export interface RoleI {
    id: number,
    role: string,
}

export class Role {
    public readonly id: number;
    public readonly role: string;

    private constructor({ id, role }: Role) {
        this.id = id;
        this.role = role;
    }

    static mapper(roles: Partial<RoleI>[]) {
        return roles.map(Role.create);
    }

    static create(roleDb: Partial<RoleI>) {
        const { id, role }= roleDb;

        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(!role || typeof role !== 'string') throw ServerError.badRequest('El Role es requerido');

        return new Role({ id, role });
    }

}