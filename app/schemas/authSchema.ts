import { z } from "zod";
import { userName } from "./genericSchema";

export const loginSchema = z.object({
    userName,
    password: z.string({
      invalid_type_error: "Contraseña invalida",
      required_error: "Requerido",
    }).min(6, { message: 'La contraseña debe ser de 5 o más caracteres'}),
});
