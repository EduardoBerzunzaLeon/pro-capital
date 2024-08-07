import { z } from "zod";

export const loginSchema = z.object({
    userName: z.string({
      invalid_type_error: "Usuario invalido",
      required_error: "Requerido",
    }).min(5, { message: 'El usuario debe ser de 5 o más caracteres'}),
    password: z.string({
      invalid_type_error: "Contraseña invalida",
      required_error: "Requerido",
    }).min(6, { message: 'La contraseña debe ser de 5 o más caracteres'}),
});
