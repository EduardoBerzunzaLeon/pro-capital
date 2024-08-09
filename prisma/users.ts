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
    { name: '1', isActive: true },
    { name: '2', isActive: true },
]

// -- Se hace sola
export const agent_routes = []

export const municipalities = [ 
    { name: 'campeche' },
    { name: 'calkini' },
    { name: 'chetumal' },
    { name: 'maxcanu' },
]

export const tows = [
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
        name: 'carrillo puerto 1',  
        town: 'carrillo puerto', 
        route: '1'
    },
    { 
        name: 'sihochac 1',  
        town: 'sihochac', 
        route: '1'
    },
    { 
        name: 'champoton 1',  
        town: 'champoton', 
        route: '1'
    },
    { 
        name: 'champoton 2',  
        town: 'champoton', 
        route: '1'
    },
    { 
        name: 'maxcanu 1',  
        town: 'maxcanu', 
        route: '2'
    },
]

export const groups = [
    {
        name: '10',
        folder: 'maxcanu 1'
    },
    {
        name: '1',
        folder: 'champoton 1'
    },
    {
        name: '2',
        folder: 'champoton 1'
    },
    {
        name: '3',
        folder: 'champoton 1'
    },
]

export const users = [
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
        appointment: 'Sistemas',
    },
    {
        email: 'carlos.berzunza@gmail.com',
        name: 'carlos agustin',
        lastNameFirst: 'berzunza',
        lastNameLast: 'león',
        username: 'carlos.berzunza',
        password: '123456',
        isActive: true,
        role: 'AGENT',
        address: 'colonial jardines',
        sex: 'MASCULINO',
        avatar: '',
        appointment: 'Agente',
    },
]


export const clients = [
    {
        name: 'fatima',
        lastNameFirst: 'pacheco',
        lastNameLast: 'bernes',
        address: 'fraccionamiento la riviera',
        reference: 'casa blanca de dos pisos',
        curp: 'FATM290893MCCNRD01',
        guarantee: 'television de 30 in',
        type: 'NORMAL',
        lastTown: 'champoton 1',
        lastGroup: '2'
    },
    {
        name: 'maria',
        lastNameFirst: 'berzunza',
        lastNameLast: 'leon',
        address: 'calle 2 col san joaquin',
        reference: 'a lado del pollo pollon',
        curp: 'JATM290893MCCNRD01',
        guarantee: 'television de 30 in',
        type: 'LIDER',
        lastTown: 'champoton 1',
        lastGroup: '2'
    },
    {
        name: 'carlos',
        lastNameFirst: 'berzunza',
        lastNameLast: 'leon',
        address: 'col jardines',
        reference: 'casa blanca de dos pisos',
        curp: 'BELC290893MCCNRD01',
        guarantee: 'television de 30 in',
        type: 'EMPLEADO',
        lastTown: 'maxcanu 1',
        lastGroup: '10'
    },
]


//  El aval tiene que ser de la misma localidad que el credito?
export const avals = [
    {
        name: 'fatima',
        lastNameFirst: 'bernes',
        lastNameLast: 'hermoxa',
        address: 'col bosque real',
        reference: 'atras de refaccionaria leon',
        curp: 'FATN290893MCCNRD01',
        guarantee: 'television de 30 in',
        lastTown: 'champoton 1',
    },
    {
        name: 'patricia',
        lastNameFirst: 'valencia',
        lastNameLast: 'ortiz',
        address: 'col bosque real',
        reference: 'acostado de ecomoda',
        curp: 'PVOR290893MCCNRD01',
        guarantee: 'television de 30 in',
        lastTown: 'maxcanu 1',
    },
]

export const credits = [
    {
        aval: 'FATN290893MCCNRD01',
        client: 'FATM290893MCCNRD01',
        group: '2',
        amount: 1500,
        paymentAmount: 150,
        captureAt: Date.now(),
        creditAt: Date.now(),
        canRenovate: false,
        nextPayment: Date.now(),
        lastPayment: Date.now(),
        currentDebt: 1200,
        status: 'ACTIVO',
    }
]

export const paymentDetail = [
    {
        credit: 'FATM290893MCCNRD01_champoton-1_2',
        paymentAmount: 300,
        paymentDate: Date.now(),
        captureAt: Date.now(),
        agendt: 'eduardo.berzunza',
        notes: 'adelanto el pago, por que no estara la proxima semana',
        status: 'ADELANTO'
    }
]