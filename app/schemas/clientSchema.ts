import { z } from "zod";

import { 
    curp, 
    name, 
    lastNameFirst, 
    lastNameLast, 
    stringSchema 
} from "./genericSchema";

export const clientUpdateSchema = z.object({
    name,
    lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('Dirección'),
    reference: stringSchema('Referencia'),
    curp: curp,
    phoneNumber: stringSchema('Numero de telefono')
});


export type ClientUpdateSchema =  z.infer<typeof clientUpdateSchema>;