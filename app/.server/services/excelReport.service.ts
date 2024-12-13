import dayjs from 'dayjs';

const formatDate = (date: Date, withDetail: boolean = true) => {
    if(withDetail) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }

    return dayjs(date).format('YYYY-MM-DD')
};

type CreatedI = {
    createdAt: Date,
    createdBy: {
        fullName: string
    }
}

const getCreatedData = <T extends CreatedI>({ createdAt, createdBy }: T) => {
    return {   
        createdAt: formatDate(createdAt),
        createdBy: createdBy.fullName
    }
}

export type FolderProps = CreatedI & {
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
        name, town, route, leaders, _count, ...rest
    }) => {

        return {
            name,
            town: town.name,
            municipality: town.municipality.name,
            route: route.name,
            leader: leaders.length > 0 ? leaders[0].fullname : '',
            groups: _count.groups,
            ...getCreatedData(rest)
        };
    })
}

export type TownProps = CreatedI & {
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
        name, municipality, ...rest
    }) => {
        return {
            name,
            municipality: municipality.name,
            ...getCreatedData(rest),
        };
    })
}

export type RouteProps = CreatedI & {
    name: number,
    isActive: boolean
}

export const routeReport = (props?: RouteProps[]) => {
    if(!props) {
        return [];
    }

    return props.map(({ name, isActive, ...rest }) => {
        return {
            name: `Ruta ${name}`,
            isActive: isActive ? 'Activo' : 'inactivo',
            ...getCreatedData(rest),
        }
    })
}

export type LeaderBirthdayProps =  {
    fullname: string,
    folder: string,
    address: string,
    birthday: Date,
}

export const leaderBirthdayReport = (props?: LeaderBirthdayProps[]) => {
    if(!props) {
        return [];
    }

    return props.map(({ birthday, ...rest }) => {
        return {
            ...rest,
            birthday: formatDate(birthday, false)
        }
    })
}

export type MunicipalityProps = CreatedI & {
    name: string;
}

export const municipalityReport = (props?: MunicipalityProps[]) => {
    if(!props) return [];
    return props.map(({
        name, ...rest
    }) => {
        return {
            name,
            ...getCreatedData(rest),
        };
    })
}

export type AgentRouteProps = CreatedI & {
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

    return props.map(({ assignAt, user, route, ...rest }) => {
        return {
            user: user.fullName,
            route: `Ruta ${route.name}`,
            assignAt: formatDate(assignAt),
            ...getCreatedData(rest),
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


export type LeaderProps = CreatedI & {
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

    return props.map(({  
        isActive, 
        folder, 
        createdAt, 
        createdBy, 
        fullname,
        curp,
        birthday,
        anniversaryDate,
        address,
    }) => {

        return {
            fullname,
            curp: curp.toUpperCase(),
            address,
            anniversaryDate: formatDate(anniversaryDate, false),
            birthday: formatDate(birthday, false),
            folder: folder.name,
            isActive: isActive ? 'Activo' : 'inactivo',
            ...getCreatedData({ createdAt, createdBy })
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
    countPayments: number,
    canRenovate: boolean,
    creditAt: Date,
    nextPayment: Date,
    lastPayment: Date,
    currentDebt: number,
    status: string,
    createdBy: {
        fullName: string
    },
}


export const creditReport = (props?: CreditProps[]) => {
    if(!props) return [];

    return props.map(({  
        aval, 
        client, 
        folder, 
        group, 
        canRenovate, 
        captureAt, 
        createdBy,
        creditAt,
        nextPayment,
        lastPayment,
        ...restCredit 
    }) => {
        return {
            clientFullname: client.fullname,
            clientAdress: client.address,
            clientReference: client.reference,
            clientCurp: client.curp.toUpperCase(),
            avalFullname: aval.fullname,
            avalAdress: aval.address,
            avalReference: aval.reference,
            avalCurp: aval.curp.toUpperCase(),
            folder: folder.name,
            town: folder.town.name,
            municipality: folder.town.municipality.name,
            route: `Ruta ${folder.route.name}`,
            group: `Grupo ${group.name}`,
            canRenovate: canRenovate ? 'Con derecho' : 'Sin derecho',
            ...restCredit,
            creditAt: formatDate(creditAt), 
            nextPayment: formatDate(nextPayment, false),
            lastPayment: formatDate(lastPayment, false),
            ...getCreatedData({createdAt: captureAt, createdBy }),
        }
    })
}

export interface PaymentProps {
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
    },
    createdBy: {
        fullName: string
    }
}

export const paymentReport = (props?: PaymentProps[]) => {
    if(!props) return [];

    return props.map(({  
        agent, 
        credit, 
        captureAt,
        createdBy, 
        paymentAmount,
        paymentDate,
        folio,
        notes,
        status: paymentStatus
    }) => {

        const { 
            folder, 
            group, 
            client, 
            aval, 
            currentDebt, 
            nextPayment, 
            lastPayment,
            status  
        } = credit;

        return {
            clientName: client.fullname,
            clientCurp: client.curp.toUpperCase(),
            avalName: aval.fullname,
            avalCurp: aval.curp.toUpperCase(),
            agent: agent.fullName,
            currentDebt,
            nextPayment: formatDate(nextPayment, false),
            lastPayment: formatDate(lastPayment, false),
            creditStatus: status,
            folder: folder.name,
            town: folder.town.name,
            municipality: folder.town.municipality.name,
            route: `Ruta ${folder.route.name}`,
            group: `Grupo ${group.name}`,
            paymentAmount,
            paymentDate: formatDate(paymentDate, false),
            folio: folio ?? '',
            notes,
            status: paymentStatus,
            ...getCreatedData({createdAt: captureAt, createdBy }),
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
    leaderReport,
    roleReport,
    permissionReport,
    creditReport,
    leaderBirthdayReport,
}