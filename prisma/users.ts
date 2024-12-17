import { RoleTypes } from "@prisma/client"

interface Roles  {
    role: RoleTypes
}

export const roles: Roles[] = [
    { role: 'ASESOR' },
    { role: 'CAPTURISTA'},
    { role: 'JEFE_CAPTURA'},
    { role: 'TITULAR_RUTA'},
    { role: 'SUPERVISOR'},
    { role: 'GERENCIA'},
    { role: 'SUBGERENTE'},
    { role: 'DIRECTOR'},
    { role: 'RRHH'},
    { role: 'ADMIN'},
]

interface PremissionsI {
    name: string,
    servername: string,
    description: string,
    module: string,
    roles: RoleTypes[]
}

const allRoles: RoleTypes[] = [
    'ASESOR',
    'CAPTURISTA',
    'JEFE_CAPTURA',
    'TITULAR_RUTA',
    'SUPERVISOR',
    'GERENCIA',
    'SUBGERENTE',
    'DIRECTOR',
    'RRHH',
    'ADMIN',
];

const capture_chief: RoleTypes[] = ['JEFE_CAPTURA', 'GERENCIA', 'DIRECTOR', 'ADMIN'];
const capture: RoleTypes[] = ['CAPTURISTA','JEFE_CAPTURA', 'GERENCIA', 'DIRECTOR', 'ADMIN'];
const admins: RoleTypes[] = ['GERENCIA', 'DIRECTOR', 'ADMIN'];


const info = {
    folder: {
        name: 'folders',
        module: 'carpetas'
    },
    town: {
        name: 'town',
        module: 'localidad'
    },
    route: {
        name: 'route',
        module: 'rutas'
    },
    municipality: {
        name: 'municipality',
        module: 'municipio'
    },
    leaders: {
        name: 'leaders',
        module: 'lideres'
    },
    credits: {
        name: 'credits',
        module: 'creditos'
    },
    pays: {
        name: 'pays',
        module: 'pagos rápidos'
    },
    payments: {
        name: 'payments',
        module: 'pagos'
    },
    reports: {
        name: 'reports',
        module:  'reportes'
    },
    agents: {
        name: 'agents',
        module: 'asesores'
    },
    utils: {
        name: 'utils',
        module: 'utilidades'
    },
    users: {
        name: 'users',
        module: 'usuarios'
    },
    roles: {
        name: 'roles',
        module: 'roles'
    }
}

export const modules = [
    {
        name: 'region',
        isActive: true,
    },
    {
        name: info.credits.module,
        isActive: true
    },
    {
        name: info.folder.module,
        isActive: true
    },
    {
        name: info.agents.module,
        isActive: true
    },
    {
        name: info.leaders.module,
        isActive: true
    },
    {
        name: info.municipality.module,
        isActive: true
    },
    {
        name: info.payments.module,
        isActive: true
    },
    {
        name: info.pays.module,
        isActive: true
    },
    {
        name: info.reports.module,
        isActive: true
    },
    {
        name: info.roles.module,
        isActive: true
    },
    {
        name: info.route.module,
        isActive: true
    },
    {
        name: info.town.module,
        isActive: true
    },
    {
        name: info.users.module,
        isActive: true
    },
    {
        name: info.utils.module,
        isActive: true
    },
]

export const permissions: PremissionsI[] = [
    //  ==================  FOLDER ===================
    {
        servername: info.folder.name+'[view]',
        name: 'ver carpetas',
        description: 'permite ver los todos las carpetas',
        module: info.folder.module,
        roles: allRoles
    },
    {
        servername: info.folder.name+'[update]',
        name: 'actualizar carpeta',
        description: 'permite actualizar una carpeta',
        module: info.folder.module,
        roles: capture_chief
    },
    {
        servername: info.folder.name+'[active]',
        name: 'activar/desactivar carpeta',
        description: 'permite activar/desactivar una carpeta',
        module: info.folder.module,
        roles: admins
    },
    {
        servername: info.folder.name+'[add]',
        name: 'agregar carpeta',
        description: 'permite agregar una carpeta',
        module: info.folder.module,
        roles: capture_chief
    },
    {
        servername: info.folder.name+'[delete]',
        name: 'eliminar carpeta',
        description: 'permite eliminar una carpeta',
        module: info.folder.module,
        roles: admins
    },
    //  =============== TOWN ==============
    {
        servername: info.town.name+'[view]',
        name: 'ver localidades',
        description: 'permite ver todas las localidades',
        module: info.town.module,
        roles: allRoles
    },
    {
        servername: info.town.name+'[update]',
        name: 'actualizar localidad',
        description: 'permite actualizar una localidad',
        module: info.town.module,
        roles: capture_chief
    },
    {
        servername: info.town.name+'[add]',
        name: 'agregar localidad',
        description: 'permite agregar una localidad',
        module: info.town.module,
        roles: capture_chief
    },
    {
        servername: info.town.name+'[delete]',
        name: 'eliminar localidad',
        description: 'permite eliminar una localidad',
        module: info.town.module,
        roles: admins
    },
    //  =============== ROUTE ==============
    {
        servername: info.route.name+'[view]',
        name: 'ver rutas',
        description: 'permite ver todas las rutas',
        module: info.route.module,
        roles: allRoles
    },
    {
        servername: info.route.name+'[delete]',
        name: 'eliminar ruta',
        description: 'permite eliminar una ruta',
        module: info.route.module,
        roles: admins
    },
    {
        servername: info.route.name+'[add]',
        name: 'agregar ruta',
        description: 'permite agregar una ruta',
        module: info.route.module,
        roles: admins
    },
    {
        servername: info.route.name+'[active]',
        name: 'desactivar/activar ruta',
        description: 'permite desactivar/activar una ruta',
        module: info.route.module,
        roles: admins
    },
    //  =============== MUNICIPALITY ==============
    {
        servername: info.municipality.name+'[view]',
        name: 'ver municipios',
        description: 'permite ver todos los municipios',
        module: info.municipality.module,
        roles: allRoles
    },
    {
        servername: info.municipality.name+'[update]',
        name: 'actualizar municipio',
        description: 'permite actualizar un municipio',
        module: info.municipality.module,
        roles: capture_chief
    },
    {
        servername: info.municipality.name+'[add]',
        name: 'agregar municipio',
        description: 'permite agregar un municipio',
        module: info.municipality.module,
        roles: admins
    },
    {
        servername: info.municipality.name+'[delete]',
        name: 'eliminar municipio',
        description: 'permite eliminar un municipio',
        module: info.municipality.module,
        roles: admins
    },
    //  =============== LEADERS ==============
    {
        servername: info.leaders.name+'[view]',
        name: 'ver lideres',
        description: 'permite ver todas las lideres',
        module: info.leaders.module,
        roles: allRoles
    },
    {
        servername: info.leaders.name+'[update]',
        name: 'actualizar lider',
        description: 'permite actualizar una líder',
        module: info.leaders.module,
        roles: admins
    },
    {
        servername: info.leaders.name+'[add]',
        name: 'agregar líder',
        description: 'permite agregar una líder',
        module: info.leaders.module,
        roles: capture_chief
    },
    {
        servername: info.leaders.name+'[delete]',
        name: 'eliminar líder',
        description: 'permite eliminar una líder',
        module: info.leaders.module,
        roles: admins
    },
    {
        servername: info.leaders.name+'[active]',
        name: 'desactivar/activar líder',
        description: 'permite desactivar/activar una líder',
        module: info.leaders.module,
        roles: admins
    },
    // =============== CREDIT =================
    {
        servername: info.credits.name+'[view]',
        name: 'ver créditos',
        description: 'permite ver todas los créditos',
        module: info.credits.module,
        roles: allRoles
    },
    {
        servername: info.credits.name+'[layout]',
        name: 'descargar plantilla',
        description: 'permite descargar la plantilla de los créditos',
        module: info.credits.module,
        roles: capture
    },
    {
        servername: info.credits.name+'[statistics]',
        name: 'descargar estadísticas',
        description: 'permite descargar las estadísticas de los créditos',
        module: info.credits.module,
        roles: capture_chief
    },
    {
        servername: info.credits.name+'[add]',
        name: 'agregar crédito',
        description: 'permite agregar un crédito',
        module: info.credits.module,
        roles: capture
    },
    {
        servername: info.credits.name+'[add-additional]',
        name: 'agregar crédito adicional',
        description: 'permite agregar un crédito adicional',
        module: info.credits.module,
        roles: capture_chief
    },
    {
        servername: info.credits.name+'[renovate]',
        name: 'renovar crédito',
        description: 'permite renovar un crédito',
        module: info.credits.module,
        roles: capture
    },
    {
        servername: info.credits.name+'[delete]',
        name: 'eliminar crédito',
        description: 'permite eliminar un crédito',
        module: info.credits.module,
        roles: capture_chief
    },
    {
        servername: info.credits.name+'[update-client]',
        name: 'editar cliente',
        description: 'permite editar los datos personales del cliente',
        module: info.credits.module,
        roles: capture
    },
    {
        servername: info.credits.name+'[update-aval]',
        name: 'editar aval',
        description: 'permite editar los datos personales del aval',
        module: info.credits.module,
        roles: capture
    },
    {
        servername: info.credits.name+'[update]',
        name: 'editar crédito',
        description: 'permite editar un crédito',
        module: info.credits.module,
        roles: admins
    },
    {
        servername: info.credits.name+'[view-detail]',
        name: 'ver detalles crédito',
        description: 'permite ver los detalles del crédito',
        module: info.credits.module,
        roles: allRoles
    },
    //  ================== FAST PAYMENTS ==================
    {
        servername: info.pays.name+'[view]',
        name: 'ver créditos para pagos',
        description: 'permite ver los créditos para pagos',
        module: info.pays.module,
        roles: allRoles
    },
    {
        servername: info.pays.name+'[add]',
        name: 'agregar pago rápido',
        description: 'permite agregar un pago rápido',
        module: info.pays.module,
        roles: capture
    },
    {
        servername: info.pays.name+'[add-no-payment]',
        name: 'agregar no pago rápido',
        description: 'permite agregar un no pago rápido',
        module: info.pays.module,
        roles: capture
    },
    {
        servername: info.pays.name+'[delete]',
        name: 'eliminar pago rápido',
        description: 'permite eliminar unicamente los pagos de hoy',
        module: info.pays.module,
        roles: capture_chief
    },
    //  ============= PAYMENTS HISTORY ========================
    {
        servername: info.payments.name+'[view]',
        name: 'ver historial de pagos',
        description: 'permite ver el historial de pagos',
        module: info.payments.module,
        roles: allRoles
    },   
    {
        servername: info.payments.name+'[add]',
        name: 'agregar pago',
        description: 'permite agregar un pago',
        module: info.payments.module,
        roles: admins
    },   
    {
        servername: info.payments.name+'[delete]',
        name: 'eliminar pago',
        description: 'permite eliminar un pago',
        module: info.payments.module,
        roles: admins
    },   
    {
        servername: info.payments.name+'[update]',
        name: 'editar pago',
        description: 'permite editar un pago',
        module: info.payments.module,
        roles: admins
    },   
    // ================ REPORTS ================
    {
        servername: info.folder.name+'[report]',
        name: 'descargar carpetas',
        description: 'permite descargar en excel las carpetas',
        module: info.folder.module,
        roles: capture_chief
    },
    {
        servername: info.town.name+'[report]',
        name: 'descargar localidades',
        description: 'permite descargar en excel las localidades',
        module: info.town.module,
        roles: capture_chief
    },
    {
        servername: info.route.name+'[report]',
        name: 'descargar rutas',
        description: 'permite descargar en excel las rutas',
        module: info.route.module,
        roles: capture_chief
    },
    {
        servername: info.municipality.name+'[report]',
        name: 'descargar municipios',
        description: 'permite descargar en excel los municipios',
        module: info.municipality.module,
        roles: capture_chief
    },
    {
        servername: info.leaders.name+'[report]',
        name: 'descargar lideres',
        description: 'permite descargar en excel las lideres',
        module: info.leaders.module,
        roles: capture_chief
    },
    {
        servername: info.leaders.name+'[report-birthday]',
        name: 'descargar cumpleaños de lideres',
        description: 'permite descargar en excel los cumpleaños de líderes por día',
        module: info.leaders.module,
        roles: capture_chief
    },
    {
        servername: info.credits.name+'[report]',
        name: 'descargar creditos',
        description: 'permite descargar en excel los creditos',
        module: info.credits.module,
        roles: capture_chief
    },
    {
        servername: info.roles.name+'[report]',
        name: 'descargar roles',
        description: 'permite descargar en excel los roles',
        module: info.roles.module,
        roles: admins
    },
    {
        servername: info.roles.name+'[report-permissions]',
        name: 'descargar permisos del rol',
        description: 'permite descargar en excel los permisos de un rol',
        module: info.roles.module,
        roles: admins
    },
    {
        servername: info.payments.name+'[report]',
        name: 'descargar pagos',
        description: 'permite descargar en excel los pagos',
        module: info.payments.module,
        roles: capture_chief
    },
    {
        servername: info.agents.name+'[report]',
        name: 'descargar rutas-asesores',
        description: 'permite descargar en excel las asignaciones de rutas-asesores',
        module: info.agents.module,
        roles: admins
    },
    {
        servername: info.users.name+'[report]',
        name: 'descargar usuarios',
        description: 'permite descargar en excel las usuarios',
        module: info.users.module,
        roles: admins
    },
    // ================== AGENTS =================
    {
        servername: info.agents.name+'[view]',
        name: 'ver asesores-rutas',
        description: 'permite ver los asesores-rutas',
        module: info.agents.module,
        roles: [...capture_chief, 'SUPERVISOR']
    },
    {
        servername: info.agents.name+'[add]',
        name: 'agregar asesores-rutas',
        description: 'permite agregar asesores-rutas por fecha',
        module: info.agents.module,
        roles: admins
    },
    {
        servername: info.agents.name+'[delete]',
        name: 'eliminar asesor-ruta',
        description: 'permite eliminar la asignación del asesor a la ruta por fecha',
        module: info.agents.module,
        roles: admins
    },
    {
        servername: info.utils.name+'[generate-overdue]',
        name: 'generar pagos vencidos',
        description: 'permite generar los pagos vencidos',
        module: info.utils.module,
        roles: admins
    },
    {
        servername: info.utils.name+'[generate-groups]',
        name: 'generar grupos',
        description: 'permite generar grupos',
        module: info.utils.module,
        roles: admins
    },
    // =============== USERS ===============
    {
        servername: info.users.name+'[view]',
        name: 'ver usuarios',
        description: 'permite ver los usuarios',
        module: info.users.module,
        roles: [...admins, 'RRHH']
    },
    {
        servername: info.users.name+'[add]',
        name: 'agregar usuario',
        description: 'permite agregar un usuario',
        module: info.users.module,
        roles: [...admins, 'RRHH']
    },
    {
        servername: info.users.name+'[update]',
        name: 'editar usuario',
        description: 'permite editar un usuario',
        module: info.users.module,
        roles: [...admins, 'RRHH']
    },
    {
        servername: info.users.name+'[active]',
        name: 'desactivar/activar usuario',
        description: 'permite desactivar/activar a un usuario',
        module: info.users.module,
        roles: [...admins, 'RRHH']
    },
    {
        servername: info.users.name+'[update-security]',
        name: 'editar datos de seguridad',
        description: 'permite editar los datos de seguridad de un usuario',
        module: info.users.module,
        roles: [...admins, 'RRHH']
    },
    // ================== ROLES =================
    {
        servername: info.roles.name+'[update]',
        name: 'asigar permisos',
        description: 'permite editar las asignaciones de permisos a los roles',
        module: info.roles.module,
        roles: admins
    },
    {
        servername: info.roles.name+'[view]',
        name: 'ver roles',
        description: 'permite ver los roles',
        module: info.roles.module,
        roles: admins
    },
    {
        servername: info.roles.name+'[view-detail]',
        name: 'ver permisos',
        description: 'permite ver los roles y los permisos asignados a estos',
        module: info.roles.module,
        roles: admins
    },
    //  =============== REGION ===============
    {
        servername: 'region[view]',
        name: 'ver regiones',
        description: 'permite mostrar el menu de region',
        module: 'region',
        roles: allRoles
    },
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
        name: 1,
        folder: 'maxcanu 1'
    },
    {
        name: 1,
        folder: 'champoton 1'
    },
]

type Sex = 'masculino' | 'femenino';

export type Types = 'EMPLEADO' | 'LIDER' | 'NORMAL';
  

interface User {
    email: string, 
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    username: string,
    password: string,
    isActive: boolean,
    role: RoleTypes,
    address: string,
    sex: Sex,
    avatar?: string,
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
        sex: 'masculino',
        avatar: '',
    },
    {
        email: 'carlos.berzunza@gmail.com',
        name: 'carlos agustin',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'león',
        username: 'carlos.berzunza',
        password: '123456',
        isActive: true,
        role: 'ASESOR',
        address: 'colonial jardines',
        sex: 'masculino',
        avatar: '',
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
}

export const clients: Client[] = [
    {
        name: 'fatima',
        lastNameFirst: 'pacheco',
        lastNameSecond: 'bernes',
        fullname: 'fatima pacheco bernes',
        address: 'fraccionamiento la riviera',
        reference: 'casa blanca de dos pisos',
        curp: 'AUNI760709MCCYHV00'.toLowerCase(),
    },
    {
        name: 'maria',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'leon',
        fullname: 'maria berzunza leon',
        address: 'calle 2 col san joaquin',
        reference: 'a lado del pollo pollon',
        curp: 'JATM290893MCCNRD01'.toLowerCase(),
    },
    {
        name: 'carlos',
        lastNameFirst: 'berzunza',
        lastNameSecond: 'leon',
        fullname: 'carlos berzunza leon',
        address: 'col jardines',
        reference: 'casa blanca de dos pisos',
        curp: 'BELC290893MCCNRD01'.toLowerCase(),
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
        curp: 'AUAG840531MCCLVD01'.toLowerCase(),
    },
    {
        name: 'patricia',
        lastNameFirst: 'valencia',
        lastNameSecond: 'ortiz',
        fullname: 'patricia valencia ortiz',
        address: 'col bosque real',
        reference: 'acostado de ecomoda',
        curp: 'PVOR290893MCCNRD01'.toLowerCase(),
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
'GARANTIA';

interface Credit {
    aval: string,
    client: string,
    group: number,
    folder: string,
    amount: number,
    paymentAmount: number,
    totalAmount: number,
    captureAt: string,
    creditAt: string,
    canRenovate: boolean,
    nextPayment: string,
    lastPayment: string,
    clientGuarantee: string,
    avalGuarantee: string,
    currentDebt: number,
    paymentForgivent: number,
    status: Status
}

export const credits: Credit[] = [
    {
        aval: 'AUAG840531MCCLVD01'.toLowerCase(),
        client: 'AUNI760709MCCYHV00'.toLowerCase(),
        group: 1,
        folder: 'champoton 1',
        clientGuarantee: 'television de 30 in',
        avalGuarantee: 'aifon 16',
        amount: 1500,
        totalAmount: 2250,
        paymentAmount: 150,
        captureAt:  new Date(2024, 6, 1).toISOString(),
        creditAt:  new Date(2024, 6, 1).toISOString(),
        canRenovate: true,
        nextPayment:  new Date(2024, 6, 1).toISOString(),
        lastPayment:  new Date(2024, 6, 1).toISOString(),
        currentDebt: 750,
        status: 'ACTIVO',
        paymentForgivent: 0,
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
        client: 'AUNI760709MCCYHV00'.toLowerCase(),
        folder: 'champoton 1',
        group: 1,
        paymentAmount: 150,
        paymentDate: new Date(2024, 6, 7).toISOString(),
        captureAt: new Date(2024, 6, 7).toISOString(),
        agendt: 'carlos.berzunza',
        notes: 'adelanto el pago, por que no estara la proxima semana',
        status: 'ADELANTO'
    },
    {
        client: 'AUNI760709MCCYHV00'.toLowerCase(),
        folder: 'champoton 1',
        group: 1,
        paymentAmount: 150,
        paymentDate: new Date(2024, 6, 8).toISOString(),
        captureAt: new Date(2024, 6, 8).toISOString(),
        agendt: 'carlos.berzunza',
        notes: 'adelanto el pago, por que no estara la proxima semana',
        status: 'ADELANTO'
    },
    {
        client: 'AUNI760709MCCYHV00'.toLowerCase(),
        folder: 'champoton 1',
        group: 1,
        paymentAmount: 150,
        paymentDate: new Date(2024, 6, 9).toISOString(),
        captureAt: new Date(2024, 6, 9).toISOString(),
        agendt: 'carlos.berzunza',
        notes: 'adelanto el pago, por que no estara la proxima semana',
        status: 'ADELANTO'
    },
    {
        client: 'AUNI760709MCCYHV00'.toLowerCase(),
        folder: 'champoton 1',
        group: 1,
        paymentAmount: 1050, 
        paymentDate: new Date(2024, 6, 10).toISOString(),
        captureAt: new Date(2024, 6, 10).toISOString(),
        agendt: 'carlos.berzunza',
        notes: 'adelanto el pago, por que no estara la proxima semana',
        status: 'ADELANTO'
    },
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
        curp: 'BELE982038HCCRND01'.toLowerCase()
    },
    {
        name: 'Fatima Liset',
        lastNameFirst: 'bernes',
        lastNameSecond:'cruz',
        address: 'col fraccionarama numero 29',
        birthday: new Date(1977, 10, 13).toISOString(),
        anniversaryDate: new Date(2024, 4, 9).toISOString(),
        folder: 'maxcanu 1',
        curp: 'BERN771013HCCRND01'.toLowerCase()
    }
]