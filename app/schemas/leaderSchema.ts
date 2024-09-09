import { z } from "zod";
import { name, id, curp, alphabetBuilder, stringSchema, dateSchema } from "./genericSchema";

const lastNameFirst = alphabetBuilder({
    requiredText: 'Primer Apellido',
    minText: 'El primer apellido',
    extraText: 'El primer apellido'
});

const lastNameLast = alphabetBuilder({
    requiredText: 'Segundo Apellido',
    minText: 'El segundo apellido',
    extraText: 'El segundo apellido'
});

export const CreateLeaderSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    curp,
    address: stringSchema('La dirección'),
    folderId: id,
    birthday: dateSchema('Fecha de cumpleaños'),
    anniversaryDate: dateSchema('Fecha de alta'),
}); 

export const UnsubscribeLeaderSchema = z.object({
    date: dateSchema('Fecha de baja'),
    reason: stringSchema('El motivo de baja')
})