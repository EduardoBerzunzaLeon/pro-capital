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
