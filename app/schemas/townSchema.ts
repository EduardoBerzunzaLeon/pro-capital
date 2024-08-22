import { z } from "zod";
import { id, name } from "./genericSchema";

export const townCreateSchema = z.object({ municipalityId: id, name});