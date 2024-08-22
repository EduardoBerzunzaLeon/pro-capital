import { z } from "zod";
import { id, name } from "./genericSchema";

export const folderCreateSchema = z.object({ 
    consecutive: id,
    name,
    townId: id,
    routeId: id
});