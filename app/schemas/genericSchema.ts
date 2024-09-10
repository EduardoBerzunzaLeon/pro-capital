import { z } from "zod";

export const id = z.coerce.number({
    required_error: "ID es requerido",
    invalid_type_error: "ID debe ser un número",
})
.int({ message: 'ID debe ser entero' })
.gte(1, 'El ID tiene que ser mayor que 0')
.nonnegative({ message: 'ID debe ser positivo'})


interface AlphabetBuilder {
    requiredText: string,
    minText: string,
    extraText: string
}

export const alphabetBuilder = ({
    requiredText,
    minText,
    extraText
}: AlphabetBuilder) => z.string({
    invalid_type_error: `${requiredText} invalido`,
    required_error: "Requerido",
}).trim()
.toLowerCase()
.min(2, `${minText} debe tener minimo dos letras`)
.refine(
    (value) =>  /^[a-zA-Z ]*$/.test(value ?? ""), 
    `${extraText} solo debe tener caracteres del alfabeto`);


export const name = alphabetBuilder({
    requiredText: 'Nombre',
    minText: 'El nombre',
    extraText: 'El nombre'
})

export const curp = z.string({
    invalid_type_error: "CURP invalido",
    required_error: "Requerido",
}).trim()
.toUpperCase()
.length(18, 'La CURP debe ser de 18 caracteres')
.refine(
    (value) => {

        const re =  /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/

        const validate = value.match(re);

        if(!validate) return false;

        const verify = (curp: string) => {
            const diccionary = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
            let lngSum = 0.0;
            let lngDigit = 0.0;
            for(let i=0; i<17; i++)
                lngSum = lngSum + diccionary.indexOf(curp.charAt(i)) * (18 - i);
            lngDigit = 10 - lngSum % 10;
            if (lngDigit == 10) return 0;
            return lngDigit;
        }
        return Number(validate[2]) === verify(validate[1]);
    }, 
    'La estructura del CURP no es valida'
)
// TODO AGREGAR ESPACIOS EN EL REGEX

export const alphabet = z.string({
    invalid_type_error: "Nombre invalido",
    required_error: "Requerido",
}).trim()
.toLowerCase()
.refine(
    (value) => /^[a-zA-Z ]*$/.test(value ?? ""), 
    'El nombre solo debe tener caracteres del alfabeto'
)

export const active = z.coerce.boolean({
    invalid_type_error: "Estado invalido",
    required_error: "Requerido",
});

export const stringSchema = (requiredText: string) =>  z.string({
    invalid_type_error: `${requiredText} invalido`,
    required_error: "Requerido",
}).trim()
.toLowerCase();

export const dateSchema = (requiredText: string) => z.date({
    invalid_type_error: `${requiredText} invalido`,
    required_error: "Requerido",
})

export const idSchema = z.object({ id });
export const nameSchema = z.object({ name });
export const activeSchema = z.object({ isActive: active });
export const alphabetSchema = z.object({ value: alphabet });
export const actionSchema = z.object({ _action: alphabet });
// export const activeSchema = z.object({ id, isActive });


export default {
    idSchema,
    nameSchema,
    actionSchema,
}