import { z } from "zod";
import { id, name } from "./genericSchema";

export const municipalityDeleteSchema = z.object({ id });
export const municipalitySchema = z.object({ id, name });

