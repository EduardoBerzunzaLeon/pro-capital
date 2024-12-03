import { z } from "zod";
import { dateSchema, decimalBuilder, integerBuilder, stringSchema } from "./genericSchema";

export const paymentStatus: string[] = ['PAGO', 'PAGO_INCOMPLETO', 'NO_PAGO', 'ADELANTO', 'GARANTIA'];

const folioSchema = z.coerce.number({
    required_error: `Folio es requerido`,
    invalid_type_error: `Folio debe ser un número`,
}).int({ message: `Folio debe ser entero` })
.nonnegative({ message: `Folio debe ser positivo`});  

export const paymentSchema = z.object({
    agent: stringSchema('Agente'),
    paymentAmount: decimalBuilder('Monto Abonado'),
    paymentDate: dateSchema('Fecha del abono'),
    folio: folioSchema,
    status: z.enum(paymentStatus as [string]),
    notes: z.string().optional(),
});

export const noPaymentSchema = paymentSchema.omit({ paymentAmount: true, status: true });

export const paymentServerSchema = z.object({
    agentId: integerBuilder('ID del agente'),
    paymentAmount: decimalBuilder('Monto Abonado'),
    paymentDate: dateSchema('Fecha del abono'),
    folio: folioSchema,
    status: z.enum(paymentStatus as [string]),
    notes: z.string().optional(),
});

export const noPaymentServerSchema = paymentServerSchema.omit({ paymentAmount: true, status: true });
