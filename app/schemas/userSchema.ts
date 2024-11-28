import { z } from "zod";
import { active, email, integerBuilder, lastNameFirst, lastNameLast, name, stringSchema, userName } from "./genericSchema";


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


export const UpdateUserSchema = z.object({
    name,
    lastNameFirst: lastNameFirst,
    lastNameSecond: lastNameLast,
    address: stringSchema('La dirección'),
    username: userName,
    email,
    sex: z.enum(['masculino', 'femenino']),
    role: integerBuilder('El rol'), 
    isActive: active
})