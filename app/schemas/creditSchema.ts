import { z } from "zod";
import { curp, dateSchema, integerBuilder, lastNameFirst, lastNameLast, name, stringSchema } from "./genericSchema";

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
    // curp: curp,
    guarantee: stringSchema('Garantía'),
    phoneNumber: stringSchema('Numero de telefono')
});

const group = integerBuilder('grupo');
const amount = integerBuilder('cantidad');
const creditAt = dateSchema('Fecha de alta del credito');

export const creditSchema = z.object({
    group,
    amount, 
    creditAt,
    folder: stringSchema('Carpeta'),
    types: z.enum(['NORMAL', 'EMPLEADO', 'LIDER'])
});


export const creditRenovateSchema = z.object({
    group,
    amount, 
    creditAt,
    folder: stringSchema('Carpeta'),
    types: z.enum(['NORMAL', 'EMPLEADO', 'LIDER']),
    paymentForgivent: integerBuilder('Pago perdonado')
});

export const exportLayoutSchema = z.object({
    folder: stringSchema('Carpeta'),
    group,
});

export const creditCreateSchema = z.object({
    aval: avalSchema,
    client: clientSchema,
    credit: creditSchema
})

export const creditReadmissionSchema = z.object({
    aval: avalSchema,
    client: clientSchema,
    credit: creditRenovateSchema
})

export type AvalSchema = z.infer<typeof avalSchema>;
export type ClientSchema = z.infer<typeof clientSchema>;
export type CreditSchema = z.infer<typeof creditSchema>;
export type CreditCreateSchema = z.infer<typeof creditCreateSchema>;
