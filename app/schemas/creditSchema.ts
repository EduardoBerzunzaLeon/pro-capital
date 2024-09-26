import { z } from "zod";
import { curp, lastNameFirst, lastNameLast, name, stringSchema } from "./genericSchema";

export const avalSchema = z.object({
    name,
    lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('Dirección'),
    reference: stringSchema('Referencia'),
    curp: curp,
    guarantee: stringSchema('Garantía'),
    phoneNumber: stringSchema('Numero de telefono')
});

export const clientSchema =  z.object({
    name,
    lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('Dirección'),
    reference: stringSchema('Referencia'),
    curp: curp,
    guarantee: stringSchema('Garantía'),
    phoneNumber: stringSchema('Numero de telefono')
})

export const creditCreateSchema = z.object({
    aval: avalSchema,
    client: clientSchema
})

export type AvalSchema = z.infer<typeof avalSchema>;
export type ClientSchema = z.infer<typeof clientSchema>;
export type CreditCreateSchema = z.infer<typeof creditCreateSchema>;
