export const roles = [
    { role: 'ADMIN' },
    { role: 'AGENT'},
    { role: 'CAPTURIST'}
]

export const modules = [
    {
        name: 'clientes',
        isActive: true
    },
    {
        name: 'reportes',
        isActive: true
    },
    {
        name: 'rutas',
        isActive: true
    },
]

export const permissions = [
    {
        name: 'ver clientes',
        description: 'permite ver los todos los clientes',
        module: 'clientes',
        roles: ['ADMIN', 'AGENT', 'CAPTURIST']
    },
    {
        name: 'actualizar cliente',
        description: 'permite actualizar los clientes',
        module: 'clientes',
        roles: ['ADMIN', 'CAPTURIST']
    },
    {
        name: 'renovar cliente',
        description: 'permite renovar los clientes',
        module: 'clientes',
        roles: ['ADMIN', 'CAPTURIST']
    }
]

export const routes = [
    { name: 1, isActive: true },
    { name: 2, isActive: true },
]

// -- Se hace sola
export const agent_routes = [{
    userId: 1,
    routeId: 1,
}]

export const municipalities = [ 
    { name: 'campeche' },
    { name: 'calkini' },
    { name: 'chetumal' },
    { name: 'maxcanu' },
    { name: 'champoton' },
]

export const towns = [
    { name: 'carrillo puerto', municipality: 'champoton' },
    { name: 'sihochac', municipality: 'champoton' },
    { name: 'champoton', municipality: 'champoton' },
    { name: 'calkini', municipality: 'calkini' },
    { name: 'china', municipality: 'campeche' },
    { name: 'lerma', municipality: 'campeche' },
    { name: 'maxcanu', municipality: 'maxcanu' },
]

export const folders = [
    { 
        consecutive: 1,  
        town: 'carrillo puerto', 
        name: 'carrillo puerto 1', 
        route: 1
    },
    { 
        consecutive: 1,  
        town: 'sihochac', 
        name: 'sihochac 1', 
        route: 1
    },
    { 
        consecutive: 1,  
        town: 'champoton',
        name: 'champoton 1', 
        route: 1
    },
    { 
        consecutive: 2,  
        town: 'champoton', 
        name: 'champoton 2', 
        route: 1
    },
    { 
        consecutive: 1,  
        town: 'maxcanu', 
        name: 'maxcanu 1', 
        route: 2
    },
]

export const groups = [
    {
        name: 10,
        folder: 'maxcanu 1'
    },
    {
        name: 1,
        folder: 'champoton 1'
    },
    {
        name: 2,
        folder: 'champoton 1'
    },
    {
        name: 3,
        folder: 'champoton 1'
    },
]

type Sex = 'MASCULINO' | 'FEMENINO';
type Appointment = 
'ASESOR'|
'CAPTURISTA'|
'JEFE_CAPTURA'|
'TITULAR_RUTA'|
'SUPERVISOR'|
'GERENCIA'|
'SUBGERENTE'|
'DIRECTOR';
type Types = 'EMPLEADO' | 'LIDER' | 'NORMAL';
  

interface User {
    email: string, 
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    username: string,
    password: string,
    isActive: boolean,
    role: string,
    address: string,
    sex: Sex,
    avatar?: string,
    appointment: Appointment
}

export const users: User[] = [
    {
        email: 'eduardo.berzunza@gmail.com',
        name: 'eduardo jesús',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'león',
        username: 'eduardo.berzunza',
        password: '123456',
        isActive: true,
        role: 'ADMIN',
        address: 'fraccionamiento la riviera',
        sex: 'MASCULINO',
        avatar: '',
        appointment: 'SUPERVISOR',
    },
    {
        email: 'carlos.berzunza@gmail.com',
        name: 'carlos agustin',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'león',
        username: 'carlos.berzunza',
        password: '123456',
        isActive: true,
        role: 'AGENT',
        address: 'colonial jardines',
        sex: 'MASCULINO',
        avatar: '',
        appointment: 'ASESOR',
    },
]

interface Client {
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    fullname: string,
    address: string,
    reference: string,
    curp: string,
    type: Types,
    guarantee: string
}

export const clients: Client[] = [
    {
        name: 'fatima',
        lastNameFirst: 'pacheco',
        lastNameSecond: 'bernes',
        fullname: 'fatima pacheco bernes',
        address: 'fraccionamiento la riviera',
        reference: 'casa blanca de dos pisos',
        curp: 'FATM290893MCCNRD01',
        guarantee: 'television de 30 in',
        type: 'NORMAL',
    },
    {
        name: 'maria',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'leon',
        fullname: 'maria berzunza leon',
        address: 'calle 2 col san joaquin',
        reference: 'a lado del pollo pollon',
        curp: 'JATM290893MCCNRD01',
        guarantee: 'television de 30 in',
        type: 'LIDER',
    },
    {
        name: 'carlos',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'leon',
        fullname: 'carlos berzunza leon',
        address: 'col jardines',
        reference: 'casa blanca de dos pisos',
        curp: 'BELC290893MCCNRD01',
        guarantee: 'television de 30 in',
        type: 'EMPLEADO',
    },
]


//  El aval tiene que ser de la misma localidad que el credito?
export const avals = [
    {
        name: 'fatima',
        lastNameFirst: 'bernes',
        lastNameSecond: 'hermoxa',
        fullname: 'fatima bernes hermoxa',
        address: 'col bosque real',
        reference: 'atras de refaccionaria leon',
        curp: 'FATN290893MCCNRD01',
        guarantee: 'television de 30 in',
    },
    {
        name: 'patricia',
        lastNameFirst: 'valencia',
        lastNameSecond: 'ortiz',
        fullname: 'patricia valencia ortiz',
        address: 'col bosque real',
        reference: 'acostado de ecomoda',
        curp: 'PVOR290893MCCNRD01',
        guarantee: 'television de 30 in',
    },
]

type Status = 'ACTIVO' |
'VENCIDO' |
'LIQUIDADO' |
'RENOVADO' |
'FALLECIDO';

type PaymentStatus =
'PAGO' |
'PAGO_INCOMPLETO' |
'NO_PAGO' |
'ADELANTO' |
'LIQUIDO' |
'GARANTIA';

interface Credit {
    aval: string,
    client: string,
    group: number,
    folder: string,
    amount: number,
    paymentAmount: number,
    captureAt: string,
    creditAt: string,
    canRenovate: boolean,
    nextPayment: string,
    lastPayment: string,
    currentDebt: number,
    paymentForgivent: number,
    status: Status
}

export const credits: Credit[] = [
    {
        aval: 'FATN290893MCCNRD01',
        client: 'FATM290893MCCNRD01',
        group: 2,
        folder: 'champoton 1',
        amount: 1500,
        paymentAmount: 150,
        captureAt:  new Date(2024, 6, 1).toISOString(),
        creditAt:  new Date(2024, 6, 1).toISOString(),
        canRenovate: false,
        nextPayment:  new Date(2024, 6, 1).toISOString(),
        lastPayment:  new Date(2024, 6, 1).toISOString(),
        currentDebt: 1200,
        status: 'ACTIVO',
        paymentForgivent: 0
    }
]

interface PaymentDetail {
    client: string;
    folder: string,
    group: number,
    paymentAmount: number,
    paymentDate: string,
    captureAt: string,
    agendt: string,
    notes: string,
    status: PaymentStatus
}

export const paymentDetail: PaymentDetail[] = [
    {
        client: 'FATM290893MCCNRD01',
        folder: 'champoton 1',
        group: 2,
        paymentAmount: 300,
        paymentDate: new Date(2024, 6, 1).toISOString(),
        captureAt: new Date(2024, 6, 1).toISOString(),
        agendt: 'carlos.berzunza',
        notes: 'adelanto el pago, por que no estara la proxima semana',
        status: 'ADELANTO'
    }
]

export const leaders = [
    {
        name: 'maria juana',
        lastNameFirst: 'valencia',
        lastNameSecond:'pech',
        address: 'my casita linda',
        birthday: new Date(1984, 6, 1).toISOString(),
        anniversaryDate: new Date(2024, 6, 1).toISOString(),
        unsubscribeDate: new Date(2024, 6, 1).toISOString(),
        folder: 'champoton 1',
        curp: 'BELE982038HCCRND01'
    },
    {
        name: 'Fatima Liset',
        lastNameFirst: 'bernes',
        lastNameSecond:'cruz',
        address: 'col fraccionarama numero 29',
        birthday: new Date(1977, 10, 13).toISOString(),
        anniversaryDate: new Date(2024, 4, 9).toISOString(),
        folder: 'maxcanu 1',
        curp: 'BERN771013HCCRND01'
    }
]