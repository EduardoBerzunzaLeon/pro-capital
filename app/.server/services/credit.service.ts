import { curpSchema, idSchema } from "~/schemas/genericSchema";
import { Service } from ".";
import { Repository } from "../adapter";
import { Credit } from "../domain/entity";
import { AvalCreateI, ClientCreateI, ClientUpdateI, CreditCreateI, PaginationWithFilters, UpdateCreateI, UpdatePreviousData } from "../domain/interface";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { creditCreateSchema } from "~/schemas";
import dayjs from 'dayjs';
import { PaymentI, RequestId } from "../interfaces";
import { creditReadmissionSchema, exportLayoutSchema, renovateSchema } from "~/schemas/creditSchema";
import { calculateAmount, convertDebt } from "~/application";
import { CreditLayout, Layout } from "../domain/entity/layout.entity";

export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } = await Repository.credit.findAll({...props});
    return Service.paginator.mapper({
        metadata,
        data,
        mapper: Credit.mapper,
        errorMessage: 'No se encontraron creditos'
    });
}

//  =================== VERIFY ==================
export const verifyToCreate =  async ( form: FormData ) => {
    const { curp } = validationConform(form, curpSchema);
    const clientDb = await Repository.credit.findByCurp(curp.toLowerCase());
    
    console.log({curp, clientDb});

    if(!clientDb) {
        return { status: 'new_record' }
    }

    if(clientDb.client.isDeceased) {
        throw ServerError.badRequest('El cliente fallecio.');
    }

    const creditsDb = await Repository.credit.findCredits(curp.toLowerCase());

    if(!creditsDb || creditsDb.length === 0) {
        throw ServerError.badRequest('El cliente existe pero no tiene creditos asignados, consultar al administrador');
    }
    
    return  { status: 'renovate' };
}

//  =================== CREATE ==================

export const validationToCreate = async (curp?: string) => { 
    
    const { curp: curpValidated } = validationZod({ curp }, curpSchema);

    const clientDb = await Repository.credit.findByCurp(curpValidated);
    if(clientDb) {
        throw ServerError.badRequest('El cliente ya existe')
    }

    return curpValidated;
} 

//  =================== RENOVATE ==================

export const validationToRenovate = async (curp?: string, creditId?: RequestId) => {

    const { 
        curp: curpValidated, 
        creditId: creditIdValidated 
    } = validationZod({ curp, creditId }, renovateSchema);
    
    const clientDb = await Repository.credit.findByRenovate(creditIdValidated, curpValidated.toLowerCase());

    if(!clientDb) {
        throw ServerError.badRequest('No se encontro el cliente asociado al crédito');
    }

    if(clientDb.client.isDeceased) {
        throw ServerError.badRequest('El cliente fallecio.');
    }

    const creditDb = await Repository.credit.findCredit(creditIdValidated);

    if(!creditDb) {
        throw ServerError.badRequest('No se encontro el crédito solicitado, favor de verificarlo');
    }
    
    if(creditDb.status === 'LIQUIDADO') {
        throw ServerError.badRequest('El crédito ya ha sido liquidado');
    }
    
    if(creditDb.status === 'FALLECIDO') {
        throw ServerError.badRequest('El cliente ya fallecio.');
    }
    
    if(creditDb.client.curp.toUpperCase() !== curpValidated.toUpperCase()) {
        throw ServerError.badRequest('El CURP del cliente no coincide con el crédito.');
    }

    const canRenovate =  verifyCanRenovate(creditDb as CreditI);

    if(!canRenovate) {
        throw ServerError.badRequest(`El cliente ${creditDb.client.fullname} no ha pagado el minimo para renovar`);
    }

    const hasPaymentForgivent = canHavePaymentForgivent(creditDb.creditAt, creditDb.paymentAmount, creditDb.payment_detail); 

    return {
        credit: creditDb,
        hasPaymentForgivent,
        curp: curpValidated,
    };
}

//  ============= Additional ==================

export const validationToAdditional = async (curp?: string) => {
    
    const { curp: curpValidated } = validationZod({ curp }, curpSchema);
    const clientDb = await Repository.credit.findByCurp(curpValidated);

    if(!clientDb) {
        throw ServerError.badRequest(`No se encontro el CURP ${curpValidated}.`);
    }

    if(clientDb.client.isDeceased) {
        throw ServerError.badRequest('El cliente fallecio.');
    }

    return clientDb.client;
}

export const createClient = async ( client: Omit<ClientCreateI, 'fullname'>, fullname: string ) => {

    const clientDb = await Service.client.createOne({ ...client, fullname });

    if(!clientDb) throw ServerError.badRequest('No se pudo guardar el cliente, favor de intentarlo de nuevo.');

    return clientDb;
} 

export const updateClientToRenovate = async ( curp: string, client: Omit<ClientUpdateI, 'fullname'>, fullname: string) => {
    const clientDb = await Service.client.updateOne(curp, { ...client, fullname });
    if(!clientDb) throw ServerError.badRequest('No se pudo actualizar los datos del cliente, favor de intentarlo de nuevo.');
    return clientDb;
} 

export const updatePrevious = async (id: number, data: UpdatePreviousData) => {
    const creditDb = await Repository.credit.updatePrevious(id, data);
    if(!creditDb) throw ServerError.internalServer('No se pudo actualizar los datos del crédito anterior');
    return creditDb;
}

export const createAval = async ( aval: Omit<AvalCreateI, 'fullname'>, fullname: string, idClient: number) => {

    const { curp, ...restAval } = aval;

    const avalDb = await Service.aval.upsertOne({ curp: curp.toLowerCase(), fullname, ...restAval });

    if(avalDb) {
        return avalDb;
    }

    await Service.client.deleteOne(idClient);
    throw ServerError.internalServer('No se pudo crear el aval, favor de intentarlo de nuevo.');
}

 const deleteClient = async (clientId: number) => {

    const hasCreditsClient = await Repository.client.hasCredits(clientId);

    if(!hasCreditsClient) {
        Repository.client.deleteOne(clientId)
    }
}

const deleteAval = async (avalId: number) => {
    
    const hasCreditsAval = await Repository.aval.hasCredits(avalId);
    
    if(!hasCreditsAval) {
        Repository.aval.deleteOne(avalId)
    }
 }

export const createCredit = async (credit: CreditCreateI) => {
    const creditDb = await Repository.credit.createOne(credit);
    if(creditDb) {
        return creditDb;
    }

    await Promise.all([
        deleteClient(credit.clientId),
        deleteAval(credit.avalId),
    ]);

    throw ServerError.internalServer('No se pudo crear el credito, favor de intentarlo de nuevo.');
}

export const verifyRenovateDates = async (payments: PaymentI[], creditAt: Date) => {
    
    const dates = payments.map(({ paymentDate }) => paymentDate.getTime());
    const lastDate = Math.max(...dates);
    const newCreditAt = creditAt.getTime();

    if(newCreditAt <= lastDate) {
        throw ServerError.badRequest('El nuevo credito no puedo ser menor o igual al ultimo pago');
    }
    
}

export const renovate = async (form: FormData, curp?: string, creditId?: RequestId) => {
    const { credit: creditDb, curp: curpValidated } =  await validationToRenovate(curp, creditId);
    const { aval, client, credit } =  validationConform(form, creditReadmissionSchema);

    if(curpValidated ===  aval.curp) {
        throw ServerError.badRequest('El curp del cliente no puede ser igual al curp del aval');
    }  

    verifyRenovateDates(creditDb.payment_detail, credit.creditAt);
    const clientFullname = Service.utils.concatFullname({ ...client });
    const avalFullname = Service.utils.concatFullname({ ...aval });

    const { amount, type, creditAt } = credit;
    const maxAmountAllowed = Number(creditDb.amount)+500;

    if(amount > maxAmountAllowed ) {
        throw ServerError.badRequest(`El nuevo monto no puede superar los $${maxAmountAllowed}`);
    }

    const nextPayment = dayjs(creditAt).add(7, 'day').toDate();

    const folderDb = await Repository.folder.findByNameAndGroup(credit.folder, credit.group);
  
    if(!folderDb || !folderDb.groups || folderDb.groups.length != 1) {
        throw ServerError.badRequest('La carpeta y el grupo no son validos');
    }

    const otherCreditInFolder = await Repository.credit.verifyCredit(creditDb.id, folderDb.id);

    if(otherCreditInFolder) {
        throw ServerError.badRequest('La carpeta a la que se desea asignar el crédito, ya tiene otro crédito asignado');
    }

    const { guarantee: clientGuarantee , ...restClient } = client;
    const { guarantee: avalGuarantee , ...restAval } = aval;

    const paymentAmount = calculateAmount(Number(amount));
    const { totalAmount } = convertDebt(paymentAmount, type);

    const clientDb = await updateClientToRenovate( curpValidated.toLowerCase(), { ...restClient, curp: curpValidated.toLowerCase() }, clientFullname );
    const avalDb = await createAval(restAval , avalFullname, clientDb.id);

    const preCredit: UpdateCreateI = {
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
        status: 'RENOVADO',
        previousCreditId: creditDb.id,
        paymentForgivent: credit?.paymentForgivent ? 1: 0
    }

    const newCredit = await createCredit(preCredit);
    await updatePrevious(creditDb.id, { canRenovate: false, previousStatus: creditDb.status, status: 'LIQUIDADO' });

    return newCredit;
}

export const additional =  async (form: FormData, curp?: string) => {
    const { curp: curpValidated } = await validationToAdditional(curp);
    const { aval, client, credit } =  validationConform(form, creditCreateSchema);

    if(curpValidated ===  aval.curp) {
        throw ServerError.badRequest('El curp del cliente no puede ser igual al curp del aval');
    }  

    const clientExists = await Repository.credit.findByCurp(curpValidated);
    if(!clientExists) {
        throw ServerError.badRequest('El cliente no existe')
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

    const creditInFolder = await Repository.credit.verifyFolderInCredit(curpValidated, folderDb.id);

    if(creditInFolder) {
        throw ServerError.badRequest(`
            La carpeta a la que se desea asignar el credito 
            ya tiene un crédito vigente en estatus 
            ${creditInFolder.status}, 
            captura el dia ${creditInFolder.creditAt}`
        );
    }

    const { guarantee: clientGuarantee , ...restClient } = client;
    const { guarantee: avalGuarantee , ...restAval } = aval;

    const clientDb = await updateClientToRenovate( curpValidated.toLowerCase(), { ...restClient, curp: curpValidated.toLowerCase() }, clientFullname );
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
 
    console.log({ restClient, curpValidated });

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

const canHavePaymentForgivent = (creditAt: Date, paymentAmount: number, payments: PaymentI[]) => {

    const renovateDate =  dayjs(creditAt).add(70, 'day').toDate();
    const renovatePayments =  payments.filter((payment) => payment.paymentDate <= renovateDate); 

    for (const payment of renovatePayments) {
        if(
            (payment.paymentAmount < paymentAmount || payment.folio > 0) 
            && payment.status !== 'ADELANTO'
        ) {
            return false;
        }
    }

    return true;
}

const exportLayout = async (form: FormData) => {
    const { folder, group } = validationConform(form, exportLayoutSchema);
    const data = await Repository.credit.exportLayout(folder, group);

    if(!data) {
        throw ServerError.badRequest('No se encontraron registros');
    }
    return Layout.mapper(data as CreditLayout[]); 
}

export const deleteOne = async (id?: RequestId) => {
    const { id: idValidated } = validationZod({ id }, idSchema);
    const creditDb = await Repository.credit.findCreditForDelete(idValidated);

    if(!creditDb) {
        throw ServerError.badRequest('No se encontro el crédito');
    }
    
    if(creditDb.payment_detail.length > 0) {
        throw ServerError.badRequest('No se puede eliminar un crédito con abonos realizados');
    }
    
    if(creditDb.previousCreditId > 0) {

        const previousCreditDb = await Repository.credit.findCreditForDelete(creditDb.previousCreditId);
        if(!previousCreditDb) {
            throw ServerError.badRequest('No se encontro el crédito anterior a la renovacion');
        }

        await updatePrevious(previousCreditDb.id, { 
            canRenovate: true, 
            previousStatus: previousCreditDb.status, 
            status: previousCreditDb.previousStatus
        });
    }

    const creditDeleted = await Repository.credit.deleteOne(idValidated);

    if(!creditDeleted) {
        throw ServerError.internalServer('No se pudo eliminar el credito solicitado');
    }

    await Promise.all([
        deleteClient(creditDb.client.id),
        deleteAval(creditDb.aval.id),
    ]);
}

//  ============ VIEW CREDIT =================
export const findDetailsCredit = async (id: RequestId) => {

    const { id: idValidated } = validationZod({ id }, idSchema); 
    const creditDb = await Repository.credit.findDetailsCredit(idValidated);

    if(!creditDb) {
        throw ServerError.badRequest('No se encontro el crédito solicitado');
    }
    return creditDb;
    
}

export const verifyClientCurp = async (idClient: number, curp: string) => {

    const avals = await Repository.credit.verifyClientCurp(idClient, curp);

    if( avals && avals.length > 0 ) {
        throw ServerError.badRequest(`Se encontró el aval ${avals[0].fullname} con la CURP: ${curp}`);
    }

}

export const verifyAvalCurp = async (idAval: number, curp: string) => {

    const clients = await Repository.credit.verifyAvalCurp(idAval, curp);

    if( clients && clients.length > 0 ) {
        throw ServerError.badRequest(`Se encontró el cliente ${clients[0].fullname} con la CURP: ${curp}`);
    }

}

export default{ 
    additional,
    create,
    exportLayout,
    findAll,
    findDetailsCredit,
    renovate,
    validationToAdditional,
    validationToCreate,
    validationToRenovate,
    verifyToCreate,
    deleteOne,
    verifyAvalCurp,
    verifyClientCurp,
}