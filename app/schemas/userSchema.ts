import { z } from "zod";
import { email, integerBuilder, lastNameFirst, lastNameLast, name, stringSchema, userName } from "./genericSchema";

export const CreateUserSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('La dirección'),
    username: userName,
    email,
    sex: z.enum(['masculino', 'femenino']),
    role: integerBuilder('El rol'), 
}); 

export const UpdateRoleSchema = z.object({
    role: integerBuilder('El rol'), 
})


export const UpdateUserSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('La dirección'),
    username: userName,
    email,
    sex: z.enum(['masculino', 'femenino']),
});

export const UpdatePasswordSchema = z.object({
    password: z.string({
        invalid_type_error: "Contraseña invalida",
        required_error: "Requerido",
    }).min(6, { message: 'La contraseña debe ser de 5 o más caracteres'}),
    confirmPassword: z.string({
        invalid_type_error: "Confirmación de contraseña invalida",
        required_error: "Requerido",
    }).min(6, { message: 'La confirmacion de la contraseña debe ser de 5 o más caracteres'}),
}).refine(({password, confirmPassword}) => password === confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
});