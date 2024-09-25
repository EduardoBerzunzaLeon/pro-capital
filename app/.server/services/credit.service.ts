import { curpSchema } from "~/schemas/genericSchema";
import { Service } from ".";
import { Repository } from "../adapter";
import { Credit } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";


export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } = await Repository.credit.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data,
        mapper: Credit.mapper,
        errorMessage: 'No se encontraron creditos'
    });

}
export const validationToCreate = async (curp?: string) => {
    
    const { curp: curpValidated } = validationZod({ curp }, curpSchema);

    const clientDb = await Repository.credit.findByCurp(curpValidated);
    if(clientDb) {
        throw ServerError.badRequest('El cliente ya existe')
    }
} 

export const verifyToCreate =  async ( form: FormData ) => {
    const { curp } = validationConform(form, curpSchema);
    const clientDb = await Repository.credit.findByCurp(curp);

    if(!clientDb) {
        return { status: 'new_record' }
    }

    if(clientDb.client.isDeceased) {
        throw ServerError.badRequest('El cliente fallecio.');
    }

    const creditsDb = await Repository.credit.findLastCredit(curp);

    if(!creditsDb || creditsDb.length !== 1) {
        throw ServerError.badRequest('Ocurrio un error, intentelo más tarde');
    }

    const [ credit ] = creditsDb;
    const canRenovate =  verifyCanRenovate(credit as CreditI);

    if(!canRenovate) {
        throw ServerError.badRequest(`El cliente ${credit.client.fullname} no ha pagado el minimo para renovar`);
    }

    return  { status: 'renovate' };
}

interface CreditI {
    id: number,
    totalAmount: number,
    currentDebt: number,
    paymentAmount: number
}

const verifyCanRenovate = ({ totalAmount, currentDebt, paymentAmount }: CreditI) => {
    const minAmount =  paymentAmount * 10;
    const paidAmount =  totalAmount - currentDebt;
    return paidAmount >= minAmount;
}

export default{ 
    findAll,
    verifyToCreate,
    validationToCreate
}