import { z } from "zod";
import { active, curp, dateSchema, id, integerBuilder, lastNameFirst, lastNameLast, name, phoneNumber, stringSchema } from "./genericSchema";

export const avalSchema = z.object({
    name,
    lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('Dirección'),
    reference: stringSchema('Referencia'),
    curp: curp,
    guarantee: stringSchema('Garantía'),
    phoneNumber
});

export const renovateSchema = z.object({
    curp,
    creditId: id
});

export const clientSchema =  z.object({
    name,
    lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('Dirección'),
    reference: stringSchema('Referencia'),
    // curp: curp,
    guarantee: stringSchema('Garantía'),
    phoneNumber
});

const group = integerBuilder('grupo');
const amount = integerBuilder('cantidad');
const creditAt = dateSchema('Fecha de alta del credito');

export const rangeDatesCreditSchema = z.object({
    start: dateSchema('Fecha de inicio'),
    end: dateSchema('Fecha de fin'),
    folder: z.string().optional(),
});

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
    paymentForgivent: active
});

export const creditEditSchema = z.object({
    group,
    amount, 
    folder: stringSchema('Carpeta'),
    avalGuarantee: stringSchema('Garantias del aval'),
    clientGuarantee: stringSchema('Garantias del cliente'),
    types: z.enum(['NORMAL', 'EMPLEADO', 'LIDER']),
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
export type CreditRenovateSchema = z.infer<typeof creditRenovateSchema>;
export type CreditCreateSchema = z.infer<typeof creditCreateSchema>;
export type CreditReadmissionSchema = z.infer<typeof creditReadmissionSchema>;
