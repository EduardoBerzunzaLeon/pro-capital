import { parseWithZod } from "@conform-to/zod";
import { Schema } from "zod";
import { ValidationConformError } from "../errors";
import { Intent } from "@conform-to/react";


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

export default  {
    validationConform
}