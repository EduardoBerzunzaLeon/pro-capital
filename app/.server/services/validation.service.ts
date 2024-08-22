import { parseWithZod } from "@conform-to/zod";
import { Schema } from "zod";
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


export const validationZod = (data: Generic, schema: Schema) => {
    return schema.parse(data);    
}

export default  {
    validationConform,
    validationZod
}