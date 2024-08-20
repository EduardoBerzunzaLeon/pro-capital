import { z } from "zod";
import { id, name } from "./genericSchema";

export const townSchema = z.object({ municipalityId: id, name});