import { z } from "zod";
import { lastNameFirst, lastNameLast, name, stringSchema } from "./genericSchema";


export const CreateuserSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('La dirección'),
    sex: z.enum(['masculino', 'femenino']),
    role: z.enum([
        'ASESOR',
        'CAPTURISTA',
        'JEFE_CAPTURA',
        'TITULAR_RUTA',
        'SUPERVISOR',
        'GERENCIA',
        'SUBGERENTE',
        'DIRECTOR',
        'ADMIN'
    ]), 
}); 
