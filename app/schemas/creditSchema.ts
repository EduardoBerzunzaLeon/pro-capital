import { z } from "zod";
import { name } from "./genericSchema";

export const avalSchema = z.object({
    name
})

export const creditCreateSchema = z.object({
    aval: avalSchema,
    name: name
})