

export interface FolderProps {
    name: string;
    town: {
        name: string;
        municipality: {
            name: string
        }
    },
    route: {
        name: string,
    },
    leaders: { fullname: string }[],
    _count: {
        groups: number
    }
}


export const folderReport = (props?: FolderProps[]) => {

    if(!props) {
        return [];
    }

    return props.map(({
        name, town, route, leaders, _count
    }) => {

        return {
            name,
            town: town.name,
            municipality: town.municipality.name,
            route: route.name,
            leader: leaders.length > 0 ? leaders[0].fullname : '',
            groups: _count.groups
        };
    })
}

export interface TownProps {
    name: string,
    municipality: {
        name: string
    }
}

export const townReport = (props?: TownProps[]) => {

    if(!props) {
        return [];
    }

    return props.map(({
        name, municipality
    }) => {

        return {
            name,
            municipality: municipality.name,
        };
    })
}

export interface RouteProps {
    name: number,
    isActive: boolean
}

export const routeReport = (props?: RouteProps[]) => {
    if(!props) {
        return [];
    }

    return props.map(({ name, isActive }) => {
        return {
            name: `Ruta ${name}`,
            isActive: isActive ? 'Activo' : 'inactivo'
        }
    })
}

export interface MunicipalityProps {
    name: string;
}

export const municipalityReport = (props?: MunicipalityProps[]) => {
    if(!props) return [];
    return props;
}

export interface AgentRouteProps {
    assignAt: Date,
    user: {
        fullName: string,
    },
    route: {
        name: number
    }
}

export const agentRouteReport = (props?: AgentRouteProps[]) => {
    if(!props) return [];

    return props.map(({ assignAt, user, route }) => {
        return {
            user: user.fullName,
            route: `Ruta ${route.name}`,
            assignAt,
        }
    })
}

export interface UserProps {
    email: string,
    username: string,
    fullName: string,
    isActive: boolean,
    role: { role: string },
    address: string,
    sex: string
}

export const userReport = (props?: UserProps[]) => {
    if(!props) return [];

    return props.map(({  isActive, role, ...restUser }) => {
        return {
            ...restUser,
            role: role.role,
            isActive: isActive ? 'Activo' : 'inactivo'
        }
    })
}


export interface RoleProps {
    role: string;
}

export const roleReport = (props?: RoleProps[]) => {
    if(!props) return [];
    return props;
}

export interface PermissionProps {
    name: string;
    description: string;
    module: {
        name: string;
    },
    roles: {
        id: number,
        role: string
    }[]
}

export const permissionReport = (roleId: number, roleName: string, props: PermissionProps[]) => {
    if(!props) return [];

    return props.map(({  name, description, roles, ...rest }) => {

        const role = roles.find(role => role.id === roleId);

        return {
            name,
            description,
            role: roleName,
            isAssigned: role ? 'ASIGNADO' : 'NO ASIGNADO',
            module: rest.module.name
        }
    })
}


export interface LeaderProps {
    fullname: string,
    curp: string,
    address: string,
    anniversaryDate: Date,
    birthday: Date,
    folder: {
        name: string,
    },
    isActive: boolean
}

export const leaderReport = (props?: LeaderProps[]) => {
    if(!props) return [];

    return props.map(({  isActive, folder, ...restLeader }) => {
        return {
            ...restLeader,
            folder: folder.name,
            isActive: isActive ? 'Activo' : 'inactivo'
        }
    })
}

interface CreditFolder {
    name: string,
    town: {
        name: string,
        municipality: {
            name: string
        }
    },
    route: {
        name: number
    }
}

export interface CreditProps {
    aval: {
        fullname: string,
        address: string,
        reference: string,
        curp: string,
    }
    client: {
        fullname: string,
        address: string,
        reference: string,
        curp: string,
    },
    group: {
        name: number
    },
    folder: CreditFolder,
    amount: number,
    paymentAmount: number,
    captureAt: Date,
    creditAt: Date,
    countPayments: number,
    canRenovate: boolean,
    nextPayment: Date,
    lastPayment: Date,
    currentDebt: number,
    status: string
}


export const creditReport = (props?: CreditProps[]) => {
    if(!props) return [];

    return props.map(({  aval, client, folder, group,  canRenovate, ...restCredit }) => {
        return {
            clientFullname: client.fullname,
            clientAdress: client.address,
            clientReference: client.reference,
            clientCurp: client.curp,
            avalFullname: aval.fullname,
            avalAdress: aval.address,
            avalReference: aval.reference,
            avalCurp: aval.curp,
            folder: folder.name,
            town: folder.town.name,
            municipality: folder.town.municipality.name,
            route: `Ruta ${folder.route.name}`,
            group: `Grupo ${group.name}`,
            canRenovate: canRenovate ? 'Con derecho' : 'Sin derecho',
            ...restCredit,
        }
    })
}

interface PaymentProps {
    agent: {
        fullName: string,
    },
    paymentAmount: number,
    paymentDate: Date,
    captureAt: Date,
    folio: number,
    notes: string,
    status: string,
    credit: {
        currentDebt: number,
        nextPayment: Date,
        lastPayment: Date,
        status: string,
        group: {
            name: string,
        },
        client: {
            fullname: string,
            curp: string,
        },
        aval: {
            fullname: string,
            curp: string,
        },
        folder: CreditFolder
    }
}

export const paymentReport = (props?: PaymentProps[]) => {
    if(!props) return [];

    return props.map(({  agent, credit, ...restPayment }) => {

        const { folder, group, client, aval, ...restCredit } = credit;
        return {
            clientName: client.fullname,
            clientCurp: client.curp,
            avalName: aval.fullname,
            avalCurp: aval.curp,
            agent: agent.fullName,
            ...restCredit,
            folder: folder.name,
            town: folder.town.name,
            municipality: folder.town.municipality.name,
            route: `Ruta ${folder.route.name}`,
            group: `Grupo ${group.name}`,
            ...restPayment,
        }
    })
}


export default {
    folderReport,
    townReport,
    routeReport,
    paymentReport,
    municipalityReport,
    agentRouteReport,
    userReport,
    roleReport,
    permissionReport,
}