import { curpSchema } from "~/schemas/genericSchema";
import { Service } from ".";
import { Repository } from "../adapter";
import { Credit } from "../domain/entity";
import { AvalCreateI, ClientCreateI, CreditCreateI, PaginationWithFilters } from "../domain/interface";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { creditCreateSchema } from "~/schemas";
import dayjs from 'dayjs';

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

    return curpValidated;
} 

export const createClient = async ( client: Omit<ClientCreateI, 'fullname'>, fullname: string ) => {

    const clientDb = await Service.client.createOne({ ...client, fullname });


    console.log({clientDb});
    if(!clientDb) throw ServerError.badRequest('No se pudo guardar el cliente, favor de intentarlo de nuevo.');

    return clientDb;
} 

export const createAval = async ( aval: Omit<AvalCreateI, 'fullname'>, fullname: string, idClient: number) => {
    const avalDb = await Service.aval.upsertOne({ ...aval, fullname });

    if(avalDb) {
        return avalDb;
    }

    await Service.client.deleteOne(idClient);
    throw ServerError.internalServer('No se pudo crear el aval, favor de intentarlo de nuevo.');
}

export const createCredit = async (credit: CreditCreateI) => {
    const creditDb = await Repository.credit.createOne(credit);
    if(creditDb) {
        return creditDb;
    }

    const [ hasCredits ] = await Promise.all([
        Repository.aval.hasCredits(credit.avalId),
        Repository.client.deleteOne(credit.clientId)
    ]);

    if(!hasCredits) {
        Repository.aval.deleteOne(credit.avalId);
    }

    throw ServerError.internalServer('No se pudo crear el credito, favor de intentarlo de nuevo.');
}

export const create = async (form: FormData, curp?: string) => {

    const curpValidated =  await validationToCreate(curp);
    const { aval, client, credit } =  validationConform(form, creditCreateSchema);

    if(curpValidated ===  aval.curp) {
        throw ServerError.badRequest('El curp del cliente no puede ser igual al curp del aval');
    }  

    const clientFullname = Service.utils.concatFullname({ ...client });
    const avalFullname = Service.utils.concatFullname({ ...aval });

    const { amount, type, creditAt } = credit;
    const nextPayment = dayjs(creditAt).add(7, 'day').toDate();

    const paymentAmount = amount / 10;
    const types = {
        'NORMAL': 15,
        'EMPLEADO': 12,
        'LIDER': 10,
    }

    const weeks = type in types ? types[type as keyof typeof types] : 15;
    const totalAmount = paymentAmount * weeks;
    
    const folderDb = await Repository.folder.findByNameAndGroup(credit.folder, credit.group);
  
    if(!folderDb || !folderDb.groups || folderDb.groups.length != 1) {
        throw ServerError.badRequest('La carpeta y el grupo no son validos');
    }

    const { guarantee: clientGuarantee , ...restClient } = client;
    const { guarantee: avalGuarantee , ...restAval } = aval;
 
    const clientDb = await createClient({...restClient, curp: curpValidated}, clientFullname);
    const avalDb = await createAval(restAval, avalFullname, clientDb.id);

    const preCredit: CreditCreateI = {
        avalId: avalDb.id,
        clientId: clientDb.id,
        groupId: folderDb.groups[0].id,
        folderId: folderDb.id,
        type, 
        amount,
        paymentAmount,
        totalAmount,
        creditAt,
        clientGuarantee: clientGuarantee ?? '',
        avalGuarantee: avalGuarantee ?? '',
        nextPayment,
        currentDebt: totalAmount,
        status: 'ACTIVO',
    }

    return await createCredit(preCredit);
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
    validationToCreate,
    create
}