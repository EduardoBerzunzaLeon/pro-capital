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
})

export const creditCreateSchema = z.object({
    aval: avalSchema,
})

export type AvalSchema = z.infer<typeof avalSchema>;
export type CreditCreateSchema = z.infer<typeof creditCreateSchema>;
