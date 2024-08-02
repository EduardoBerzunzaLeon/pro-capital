const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NOMBRE", uid: "name", sortable: true},
    {name: "RFC", uid: "rfc", sortable: true},
    {name: "AVAL", uid: "aval", sortable: true},
    {name: "REFERENCIA", uid: "referencia"},
    {name: "FECHA DE PAGO", uid: "fecha_pago"},
    {name: "ESTATUS", uid: "status", sortable: true},
    {name: "DOMICLIO CLIENTE", uid: "client_address"},
    {name: "DOMICILIO AVAL", uid: "aval_address"},
    {name: "RUTA", uid: "rute"},
    {name: "GRUPO", uid: "group"},
    {name: "REGION", uid: "region"},
    {name: "LOCALIDAD", uid: "localidad"},
    {name: "MUNICIPIO", uid: "municipio"},
    {name: "FOLIO", uid: "folio"},
    {name: "RENOVACION", uid: "can_renovate"},
    {name: "FECHA DE ALTA", uid: "start_date"},
    {name: "DEUDA ACTUAL", uid: "current_debt"},
    {name: "ACTIONS", uid: "actions"},
  ];
  

  const statusOptions = [
    {name: "Activo", uid: "activo"},
    {name: "Vencido", uid: "vencido"},
    {name: "Liquidado", uid: "liquidado"},
    {name: "Renovado", uid: "renovado"},
  ];

  
  export const renovateOptions = [
    {name: "Con derecho", uid: "canRenovate"},
    {name: "Sin derecho", uid: "cantRenovate"},
  ];
  

export type ColumnSort = 
      'id' 
      | 'name' 
      | 'rfc' 
      | 'aval' 
      | 'localidad' 
      | 'referencia' 
      | 'status' 
      | 'fecha_pago'
      | 'import'
      | 'client_address'
      | 'aval_address'
      | 'rute'
      | 'group'
      | 'region'
      | 'municipio'
      | 'folio'
      | 'can_renovate'
      | 'start_date'
      | 'current_debt';

export type Columns = ColumnSort | 'actions';
export type Directions =  'ascending' | 'descending';
export type Status = 'activo' | 'vencido' | 'liquidado' | 'renovado';
export type StatusColors = "warning" | "danger" | "success" | "default" | "primary" | "secondary" | undefined;

export interface Client {
  id: number;
  name: string;
  rfc: string;
  aval: string;
  localidad: string;
  municipio: string;
  referencia: string;
  status: Status;
  import: number;
  fecha_pago: string;
  client_address: string;
  aval_address: string;
  rute: number;
  group: number;
  region: string;
  folio: number;
  can_renovate: boolean;
  start_date: string;
  current_debt: number;
}

export interface SortColumn {
  column: ColumnSort,
  direction: Directions
}

  const users: Client[] = [
    {
      id: 1,
      name: "candelaria puch koyoc",
      rfc: "PUKC240592ST3",
      aval: 'maria anastacia puch koyok',
      localidad: 'santa elena',
      municipio: 'campeche',
      referencia: 'lado del gym xtreme c.azul',
      status: 'renovado',
      import: 3000,
      fecha_pago: '2024-07-26',
      client_address: 'Calle san joaquin Numero 23 col jardines',
      aval_address: 'Calle chuvasco Numero 112 col morelos',
      rute: 1,
      group: 72,
      region: 'santa elena 1',
      folio: 11990,
      can_renovate: false,
      start_date: '2024-07-10',
      current_debt: 2500,
    },
    {
      id: 2,
      name: "yuly yasmin chulin dominguez",
      rfc: "CUDY231280TS5",
      aval: 'elvira chuc arana',
      localidad: 'santa elena',
      municipio: 'campeche',
      referencia: 'atras del restaurante chac mool c-bca',
      status: 'activo',
      import: 2500,
      fecha_pago: '2024-07-30',
      client_address: 'Calle san joaquin Numero 23 col jardines',
      aval_address: 'Calle chuvasco Numero 112 col morelos',
      rute: 1,
      group: 72,
      region: 'santa elena 1',
      folio: 11990,
      can_renovate: false,
      start_date: '2024-07-10',
      current_debt: 2500,
    },
    {
      id: 3,
      name: "ediberta herrera palomo",
      rfc: "HEPE240592AS0",
      aval: 'candelaria may euan',
      localidad: 'oxkutzcab',
      municipio: 'yucatan',
      referencia: '2 casas de la taqueria 3 reyes casa rosa',
      status: 'vencido',
      import: 2000,
      fecha_pago: '2024-08-10',
      client_address: 'Calle san joaquin Numero 23 col jardines',
      aval_address: 'Calle chuvasco Numero 112 col morelos',
      rute: 1,
      group: 72,
      region: 'santa elena 1',
      folio: 11990,
      can_renovate: false,
      start_date: '2024-07-10',
      current_debt: 2500,
    },
    {
      id: 4,
      name: "blanca estela duran chi",
      rfc: "DUCB120378QJ1",
      aval: 'nancy crisanta hernandez',
      localidad: 'champoton',
      municipio: 'campeche',
      referencia: 'la vuelta de muebleria sabancuy',
      status: 'vencido',
      import: 3000,
      fecha_pago: '2024-07-22',
      client_address: 'Calle san joaquin Numero 23 col jardines',
      aval_address: 'Calle chuvasco Numero 112 col morelos',
      rute: 1,
      group: 72,
      region: 'santa elena 1',
      folio: 11990,
      can_renovate: false,
      start_date: '2024-07-10',
      current_debt: 2500,
    },
    {
      id: 5,
      name: "eloria arevalo gomez",
      rfc: "ARGO021156ST2",
      aval: 'maria magdalena romero',
      localidad: 'yohaltun',
      municipio: 'quintana roo',
      referencia: 'a una cuadra de la tortilleria',
      status: 'liquidado',
      import: 3500,
      fecha_pago: '2024-07-24',
      client_address: 'Calle san joaquin Numero 23 col jardines',
      aval_address: 'Calle chuvasco Numero 112 col morelos',
      rute: 1,
      group: 72,
      region: 'santa elena 1',
      folio: 11990,
      can_renovate: true,
      start_date: '2024-07-10',
      current_debt: 2500,
    },
    {
      id: 6,
      name: "magnolia alvarez guillermo",
      rfc: "ALGM121278ST0",
      aval: 'victoria diaz alvarez',
      localidad: 'matamoros',
      municipio: 'wakanda',
      referencia: 'la tienda changarrito enfrente casa madera s/c',
      status: 'liquidado',
      import: 3500,
      fecha_pago: '2024-07-24',
      client_address: 'Calle san joaquin Numero 23 col jardines',
      aval_address: 'Calle chuvasco Numero 112 col morelos',
      rute: 1,
      group: 72,
      region: 'santa elena 1',
      folio: 11990,
      can_renovate: false,
      start_date: '2024-07-10',
      current_debt: 2500,
    },
  ];
  
  export {columns, users, statusOptions};