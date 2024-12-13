import { z } from "zod";
import { name, id, curp, stringSchema, dateSchema, lastNameFirst, lastNameLast, integerBuilder } from "./genericSchema";

export const CreateLeaderSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    curp,
    address: stringSchema('La dirección'),
    birthday: dateSchema('Fecha de cumpleaños'),
    anniversaryDate: dateSchema('Fecha de alta'),
}); 

export const CreateLeaderServerSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    curp,
    address: stringSchema('La dirección'),
    birthday: dateSchema('Fecha de cumpleaños'),
    anniversaryDate: dateSchema('Fecha de alta'),
    folder: id
}); 

export const UnsubscribeLeaderSchema = z.object({
    date: dateSchema('Fecha de baja'),
    reason: stringSchema('El motivo de baja')
})


export const BirthdaySchema = z.object({
    month: integerBuilder('mes'),
    day: integerBuilder('day'),
    limit: integerBuilder('limit'),
    page: integerBuilder('page'),
})

export const ExportBirthdaySchema = BirthdaySchema.omit({ limit: true, page: true });