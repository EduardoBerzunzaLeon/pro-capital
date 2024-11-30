import { ServerError } from "~/.server/errors";
import { RoleI } from './role.entity';


interface PermissionI {
    id: number,
    name: string,
    description: string,
    module: {
        name: string,
    },
    roles: RoleI[]
}

export class Permission {

    public readonly id: number;
    public readonly name: string;
    public readonly isAssigned: boolean;
    public readonly description: string;
    public readonly module: string;

    private constructor({ id, name, isAssigned, description, module }: Permission) {
        this.id = id;
        this.name = name;
        this.isAssigned = isAssigned;
        this.description = description;
        this.module = module;
    }

    static mapper = (roleId: number) => (permissions: Partial<PermissionI>[])  => {
        return permissions.map((permission) =>Permission.create(roleId, permission));
    }

    static create(roleId: number, permission: Partial<PermissionI>) {
        const { 
            id,
            name,
            roles,
            description,
        }= permission;

        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(!name || typeof name !== 'string') throw ServerError.badRequest('El nombre es requerido');
        if(!description || typeof description !== 'string') throw ServerError.badRequest('La descripción es requerido');
        if(!permission?.module?.name) {
            throw ServerError.badRequest('La descripción es requerido');
        }

        if(!roles) {
            throw ServerError.badRequest('Los roles son requeridos');
        }

        // TODO: Verify if use a where condition in role prisma, can sustitute this operation
        const role = roles.find(role => role.id === roleId);

        return new Permission({ 
            id, 
            name,
            description,
            isAssigned: !!role,
            module: permission.module.name
         });
    }
}