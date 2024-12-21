import { z } from "zod";

import { 
    curp, 
    name, 
    lastNameFirst, 
    lastNameLast, 
    stringSchema, 
    phoneNumber
} from "./genericSchema";

export const clientUpdateSchema = z.object({
    name,
    lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('Dirección'),
    reference: stringSchema('Referencia'),
    curp: curp,
    phoneNumber
});


export type ClientUpdateSchema =  z.infer<typeof clientUpdateSchema>;