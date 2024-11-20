import { parseWithZod } from "@conform-to/zod";
import { Schema, z } from "zod";
import { ValidationConformError } from "../errors";
import { Intent } from "@conform-to/react";
import { Generic } from "../interfaces";


export const validationConform = (
    form: FormData, 
    schema: Schema | ((intent: Intent | null) => Schema)
) => {

    const submission = parseWithZod(form, { schema });

    if(submission.status !== 'success') {
        throw new ValidationConformError('Error en los campos', submission.reply());
    }

    return submission.value;
}


export const validationZod = <T extends Schema>(data: Generic, schema: T): z.infer<typeof schema> => {
    return schema.parse(data);    
}

export default  {
    validationConform,
    validationZod
}