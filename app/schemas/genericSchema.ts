import { z } from "zod";

export const id = z.coerce.number({
    required_error: "ID es requerido",
    invalid_type_error: "ID debe ser un número",
})
.int({ message: 'ID debe ser entero' })
.nonnegative({ message: 'ID debe ser positivo'});


export const name = z.string({
    invalid_type_error: "Nombre invalido",
    required_error: "Requerido",
}).trim()
.toLowerCase()
.min(2, 'El nombre debe tener minimo dos letras')
.refine(
    (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ""), 
    'El nombre solo debe tener caracteres del alfabeto'
)

export const alphabet = z.string({
    invalid_type_error: "Nombre invalido",
    required_error: "Requerido",
}).trim()
.toLowerCase()
.refine(
    (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ""), 
    'El nombre solo debe tener caracteres del alfabeto'
)

export const idSchema = z.object({ id });
export const nameSchema = z.object({ name });
export const alphabetSchema = z.object({ value: alphabet });

export default {
    idSchema,
    nameSchema
}