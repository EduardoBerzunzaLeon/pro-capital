import { curpSchema, idSchema } from "~/schemas/genericSchema";
import { Service } from ".";
import { Repository } from "../adapter";
import { Credit } from "../domain/entity";
import { AvalCreateI, ClientCreateI, ClientUpdateI, CreditCreateI, PaginationWithFilters, UpdateCreateI, UpdatePreviousData, VerifyIfExitsprops } from "../domain/interface";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { creditCreateSchema } from "~/schemas";
import dayjs from 'dayjs';
import { Generic, PaymentI, RequestId, Types } from "../interfaces";
import { creditEditSchema, creditReadmissionSchema, exportLayoutSchema, rangeDatesCreditSchema, renovateSchema } from "~/schemas/creditSchema";
import { calculateAmount, convertDebt, findNow } from "~/application";
import { CreditLayout, Layout } from "../domain/entity/layout.entity";
import { Status } from "@prisma/client";
import { CreditProps } from "./excelReport.service";

export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } = await Repository.credit.findAll({...props});
    return Service.paginator.mapper({
        metadata,
        data,
        mapper: Credit.mapper,
        errorMessage: 'No se encontraron creditos'
    });
}

export const exportData = async (props:PaginationWithFilters) => {
    const data = await Repository.credit.findByReport(props);
    return Service.excel.creditReport(data as CreditProps[]);
}

//  =================== VERIFY ==================
export const verifyToCreate =  async ( form: FormData ) => {
    const { curp } = validationConform(form, curpSchema);
    const clientDb = await Repository.credit.findByCurp(curp.toLowerCase());

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

export const verifyRenovateDates = (payments: PaymentI[], creditAt: Date) => {
    
    const dates = payments.map(({ paymentDate }) => paymentDate.getTime());
    const lastDate = Math.max(...dates);
    const newCreditAt = creditAt.getTime();

    if(newCreditAt < lastDate) {
        throw ServerError.badRequest('El nuevo credito no puedo ser menor  al ultimo pago');
    }
    
}

export const updateOne = async (form: FormData, creditId?: RequestId) => {

    const { id } = validationZod({ id: creditId }, idSchema);
    const { 
        folder, 
        group, 
        amount, 
        avalGuarantee, 
        clientGuarantee,
        types 
    } = validationConform(form, creditEditSchema);

    const creditDb = await Repository.credit.findCreditToUpdate(id);

    if(!creditDb) {
        throw ServerError.badRequest('El crédito no exite');
    }

    if(creditDb.status === 'LIQUIDADO') {
        throw ServerError.badRequest('El crédito ya esta liquidado, no se puede actualizar');
    }

    const previousCredit = await Repository.credit.findCreditToUpdate(creditDb.previousCreditId);
    
    if(previousCredit) {
        const maxAmountAllowed = Number(previousCredit.amount) + 500;

        if(maxAmountAllowed < amount) {
            throw ServerError.badRequest(`El nuevo monto no puede superar los $${maxAmountAllowed}`);
        }
    }

    const folderDb = await Service.folder.findByNameAndGroup(folder, group);

    const otherCreditInFolder = await Repository.credit.verifyCredit(id, folderDb.id);

    if(otherCreditInFolder) {
        throw ServerError.badRequest('La carpeta a la que se desea asignar el crédito, ya tiene otro crédito asignado');
    }

    const paymentAmount = calculateAmount(Number(amount));
    const { totalAmount } = convertDebt(paymentAmount, types);
    const currentDebt = calculateDebt(creditDb.payment_detail, totalAmount);

    if(currentDebt < 0) {
        throw ServerError.badRequest('La deuda no pude ser negativa');
    }

    const weekQuantity = calculateWeeksByType(creditDb.type);
    const weeks = calculateWeeks(creditDb.creditAt, creditDb.paymentAmount, weekQuantity);
    const now = findNow();
    const { amount: minAmount, isBeforeFirst } = findCurrentWeek(weeks, now);
    const canRenovate = verifyCanRenovate({ totalAmount, currentDebt, paymentAmount });

    const newStatus = calculateStatus({
        minAmount,
        currentDebt,
        totalAmount,
        status: creditDb.status,
        isBeforeFirst,
        isRenovate: creditDb.isRenovate,
    });

    const data = {
        amount,
        avalGuarantee,
        canRenovate,
        clientGuarantee,
        currentDebt,
        folderId: folderDb.id,
        groupId: folderDb.groups[0].id,
        paymentAmount,
        status: newStatus,
        totalAmount,
        type: types,
    }

    const creditUpdated = await Repository.credit.updateOne(id, data);

    if(!creditUpdated) {
        throw ServerError.internalServer('No se pudo actualizar el crédito, favor de intentarlo más tarde');
    }
    
    return creditUpdated;
}

interface PaymentAmount {
    paymentAmount: number
}

const calculateDebt = (payments: PaymentAmount[], totalAmount: number) : number => {

    const totalPaid = payments.reduce((acc, { paymentAmount }) => { 
        return acc += paymentAmount
    }, 0);

    return totalAmount - totalPaid;
}

export const renovate = async (userId: number, form: FormData, curp?: string, creditId?: RequestId) => {
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

    const folderDb = await Service.folder.findByNameAndGroup(credit.folder, credit.group);
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
        isRenovate: true,
        previousCreditId: creditDb.id,
        paymentForgivent: credit?.paymentForgivent ? 1: 0
    }

    const newCredit = await createCredit({ ...preCredit, createdById: userId });
    await updatePrevious(creditDb.id, { canRenovate: false, previousStatus: creditDb.status, status: 'LIQUIDADO' });

    return newCredit;
}

export const additional =  async (userId: number, form: FormData, curp?: string) => {
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
    
    const folderDb = await Service.folder.findByNameAndGroup(credit.folder, credit.group);
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
        createdById: userId
    }

    return await createCredit(preCredit);
}

export const create = async (userId: number, form: FormData, curp?: string) => {
 
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
    
    const folderDb = await Service.folder.findByNameAndGroup(credit.folder, credit.group);

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
        createdById: userId
    }

    return await createCredit(preCredit);
}

interface CreditI {
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

export const findCreditToPay =  async (idCredit: RequestId) => {

    const { id } = validationZod({ id: idCredit }, idSchema);

    const creditDb = await Repository.credit.findCreditToPay(id);

    if( !creditDb ) {
        throw ServerError.badRequest('No se encontró el crédito');
    }

    if(creditDb.status === 'LIQUIDADO') {
        throw ServerError.badRequest('El Crédito ya fue liquidado');
    }

    if(creditDb.client.isDeceased) {
        throw ServerError.badRequest('El cliente fallecio');
    }

    return creditDb;
}

export const calculateWeeks = (creditAt: Date, paymentAmount: number, weeksQuantity: number) => {

    return Array.from({ length: weeksQuantity }).map((_, index) => {
        const multiplier = index + 1;
        return {
            date: dayjs(creditAt).add(7 * multiplier, 'day').toDate(),
            amount: paymentAmount * multiplier
        }
    });

}


export const calculateWeeksByType  = (type: Types) => {

    const reference: Record<Types, number> = {
        'NORMAL':  15,
        'EMPLEADO': 12,
        'LIDER': 10
    }

    return reference[type] ?? 15;
}

type UpdateByPayment = Omit<CreditI, 'currentDebt'> & { 
    status: Status, 
    creditAt: Date, 
    type: Types,
    isRenovate: boolean
};

interface FindStatusI {
    isOverdue: boolean, 
    isBeforeFirst: boolean, 
    currentDebt: number,
    isRenovate: boolean
}

const findStatus = ({ isOverdue, isBeforeFirst, currentDebt, isRenovate }: FindStatusI ) => {
    if(currentDebt === 0) return 'LIQUIDADO';
    if(isOverdue)  return 'VENCIDO';
    if(isBeforeFirst && isRenovate)  return 'RENOVADO';
    return 'ACTIVO';
}

const findNextPayment = (weeks: WeekPayment[], position: number, paymentDate?: Date) => {

    if(!paymentDate) {
       return weeks[0].date;
    }

    if( paymentDate > weeks[weeks.length - 1].date ) {
        return weeks[weeks.length - 1].date;
    }

    return weeks[position].date;
}

interface  CalculateStatusI {
    minAmount: number,
    currentDebt: number, 
    totalAmount: number,
    status: Status,
    isBeforeFirst: boolean,
    isRenovate: boolean
}

const calculateStatus = ({
    minAmount,
    currentDebt,
    totalAmount,
    status,
    isBeforeFirst,
    isRenovate,
}: CalculateStatusI): Status => {
    const isOverdue = isOverdueCredit(minAmount, currentDebt, totalAmount);

    return  status === 'FALLECIDO' 
        ? status
        : findStatus({ isOverdue, isBeforeFirst, currentDebt, isRenovate });
}

export const updateCreditByPayment = async (id: number, data: UpdateByPayment) => {

    const [{ sum, count }, lastPayment ] = await Promise.all([
        Service.payment.findTotalPayment(id),
        Service.payment.findLastPayment(id)
    ])

    const currentDebt = data.totalAmount - Number(sum);
    const canRenovate = verifyCanRenovate({ totalAmount: data.totalAmount, currentDebt, paymentAmount: data.paymentAmount });
    const weekQuantity = calculateWeeksByType(data.type);
    
    const weeks = calculateWeeks(data.creditAt, data.paymentAmount, weekQuantity);
    const { isBeforeFirst, position } = findCurrentWeek(weeks, lastPayment);
    const now = findNow();
    const { amount: minAmount } = findCurrentWeek(weeks, now);
    const newStatus = calculateStatus({
        minAmount,
        currentDebt,
        totalAmount: data.totalAmount,
        status: data.status,
        isBeforeFirst,
        isRenovate: data.isRenovate,
    });

    const nextPayment = findNextPayment(weeks, position, lastPayment);

    const creditUpdated = await Repository.credit.updateCreditByPayment(id, {
        currentDebt,
        status: newStatus,
        canRenovate,
        lastPayment,
        nextPayment,
        countPayments: count
    });

    if(!creditUpdated) {
        throw ServerError.internalServer('No se pudo actualizar el crédito');
    }

    return creditUpdated;
}


interface WeekPayment {
    date: Date,
    amount: number
}

export const findCurrentWeek = (weeks: WeekPayment[], currentDate?: Date) => {
    let week, amount = 0, position = 0, isBeforeFirst = false;

    for (let index = 0; index < weeks.length; index++) {
        
        week = weeks[index].date;
        amount = weeks[index].amount;   
        position = index;     

        if(!currentDate) {
            isBeforeFirst = true;
            break;
        }

        if(index + 1 === weeks.length) {
            break;
        }

        if(currentDate >= weeks[index].date && currentDate < weeks[index + 1].date) {
            position += 1;
            break;
        }
    
        if(index === 0 && currentDate < weeks[index].date) {
            isBeforeFirst = true;
            break;
        }
        
    }

    return  { week, amount, isBeforeFirst, position };
}

export const isOverdueCredit = (minAmount: number, currentDebt: number, totalLoanAmount: number) => {
    const paymentAmount =  totalLoanAmount - currentDebt;
    return (minAmount > paymentAmount);
}


export const findByPreviousCreditId = async (id: number) => {
    return await Repository.credit.findByPreviousCreditId(id);
}

export const calculateOverdueCredits = async () => {

    const credits = await Repository.credit.findInProcessCredits();

    if(!credits || credits.length === 0) {
        return
    }

    const newPromises = credits.map(credit => {

        return Service.credit.updateCreditByPayment(credit.id, {
            status: credit.status,
            totalAmount: credit.totalAmount,
            paymentAmount: credit.paymentAmount,
            creditAt: credit.creditAt,
            type: credit.type,
            isRenovate: credit.isRenovate,
        })

    })

    await Promise.all(newPromises);
    return;
}


export const findFoldersByClient = async (clientId: RequestId) => {
    const { id } = validationZod({ id: clientId }, idSchema);
    const creditDb = await Repository.credit.findFoldersByClient(id);

    if(!creditDb || creditDb.length === 0) {
        throw ServerError.badRequest('No se encontraron carpetas asignadas a creditos del usuario');
    }

    return creditDb.map(({ folder }) => folder ); 
}

export const findGroupsByFolder = async (clientId: RequestId, folderId: RequestId) => {
    const { id } = validationZod({ id: clientId }, idSchema);
    const { id: folderIdVal } = validationZod({ id: folderId }, idSchema);
    const creditDb = await Repository.credit.findGroupsByFolder(id, folderIdVal);

    if(!creditDb || creditDb.length === 0) {
        throw ServerError.badRequest('No se encontraron grupos asignadas a la carpeta');
    }

    return creditDb.map(({ group }) => group ); 
}

export const getDefaultStatistics = (name?: string) => {
    const folder = name || 'TOTAL';
    return {
        folder,
        overDueCredits:  0,
        currentDebtTotal: 0,
        newCreditsCount: 0,
        newPaymentsCount: 0,
        newPaymentsSum: 0,
        activeCredits: 0,
    }
}

const getNewCredits = (id: number, credits?: {folderId: number, _count: number}[]) => {

    if(!credits || credits.length === 0) {
        return 0;
    } 

    for (let j = 0; j < credits.length; j++) {
        const { folderId, _count } = credits[j];
        if(id === folderId) {
            credits.splice(j,1);
            return _count;
        }
    }

    return 0;
}

const getPayments = (id: number, payments: { folderId: number, counter: number, sumatory: number }[]) => {

    if(!payments || payments.length === 0) {
        return {
            newPaymentsCount: 0,
            newPaymentsSum: 0,
        }
    }

    for (let index = 0; index < payments.length; index++) {
        const { folderId, counter, sumatory } = payments[index];
        if(folderId === id) {
            payments.splice(index,1);
            return {
                newPaymentsCount: Number(counter),
                newPaymentsSum: sumatory,
            }
        }
    }

    return {
        newPaymentsCount: 0,
        newPaymentsSum: 0,
    }

}

const getOverdueCredits = (id: number, end: Date, credits?: Generic[]) => {
    let overDueCredits = 0;
    let activeCredits = 0;
    let currentDebtTotal = 0;
    const indexToDelete: number[] = [];

    if(!credits || credits.length === 0) {
        return {
            overDueCredits,
            currentDebtTotal
        }
    }

    for (let index = 0; index < credits.length; index++) {
        
         credits[index].total = 0;

         if(credits[index].folder.id !== id) continue;

         indexToDelete.push(index);

         for (let j = 0; j < credits[index].payment_detail.length; j++) {
            credits[index].total += Number(credits[index].payment_detail[j].paymentAmount);
         }
        
        const weekQuantity = calculateWeeksByType(credits[index].type);
        const weeks = calculateWeeks(credits[index].creditAt, credits[index].paymentAmount, weekQuantity);
        const { amount: minAmount } = findCurrentWeek(weeks, end);
        const currentDebt = Number(credits[index].totalAmount) - Number(credits[index].total);
        const isOverdue = isOverdueCredit(minAmount, currentDebt, credits[index].total);

        if(currentDebt !== 0) {
            activeCredits += 1;
        }

        if(isOverdue) {
            const debt = minAmount - credits[index].total;
            currentDebtTotal += debt;
            overDueCredits += 1;


            // if(index === 0 || index === 1) {
            //     console.log({ currentDebtTotal, overDueCredits, debt, minAmount, total: credits[index].total });
            // }
        }

    }

    for (let index = 0; index < indexToDelete.length; index++) {
        credits.splice(indexToDelete[index], 1);
    }
    
    return {
        overDueCredits,
        currentDebtTotal,
        activeCredits
    }
}

const findAllStatistics = async (start: Date, end: Date) => {

    const [ newCredits, folders, payments, allCredits ] = await Promise.all([
        Repository.credit.findNewCreditsByFolders(start, end),
        Service.folder.findSampleAll(),
        Repository.payment.findAllPaymentsByFolders(start, end),
        Repository.credit.findByDates(start, end)
    ]);

    
    if(!folders || folders.length === 0) {
        return getDefaultStatistics();
    }
    
    const data = [];

    for (let i = 0; i < folders.length; i++) {
        const { id, name } = folders[i];    
        let item = getDefaultStatistics(name);
        item.newCreditsCount = getNewCredits(id, newCredits as { folderId: number, _count: number}[]);
        item = {
            ...item,
            ...getPayments(id, payments),
            ...getOverdueCredits(id, end, allCredits)
        }
        data.push(item);
    }

    return data;
}

const findStatisticsByFolder = async (start: Date, end: Date, folderId: number, folderName: string) => {

    const [ newCreditsCount, newPayments, data ] = await Promise.all([
        Repository.credit.findNewCredits(start, end, folderId),
        Repository.payment.findByRangeDates(start, end, folderId),
        Repository.credit.findByDates(start, end, folderId)
    ]);

    if(!data || data.length === 0) {
        return  [getDefaultStatistics(folderName)];
    }

    let overDueCredits = 0;
    let activeCredits = 0;
    let currentDebtTotal = 0;

    for (let index = 0; index < data.length; index++) {
        
         data[index].total = 0;

         for (let j = 0; j < data[index].payment_detail.length; j++) {
            data[index].total += Number(data[index].payment_detail[j].paymentAmount);
         }
        
        const weekQuantity = calculateWeeksByType(data[index].type);
        const weeks = calculateWeeks(data[index].creditAt, data[index].paymentAmount, weekQuantity);
        const { amount: minAmount } = findCurrentWeek(weeks, end);
        const currentDebt = Number(data[index].totalAmount) - data[index].total;
        const isOverdue = isOverdueCredit(minAmount, currentDebt, data[index].total);

        if(currentDebt !== 0) {
            activeCredits += 1;
        }

        if(isOverdue) {
            const debt = minAmount - data[index].total;
            currentDebtTotal += debt;
            overDueCredits += 1;
        }
    }

    return [{ 
        folder: folderName,
        overDueCredits, 
        currentDebtTotal,  
        newCreditsCount, 
        newPaymentsCount: newPayments._count, 
        newPaymentsSum: newPayments._sum.paymentAmount ?? 0,
        activeCredits,
    }];
}

export const findOverdueCredits = async (rangeDate: { start: Date, end: Date }, folderId: RequestId, folderName?: string) => {
    const { start, end } = validationZod(rangeDate, rangeDatesCreditSchema);
    
    if(end < start) {
        throw ServerError.badRequest('La fecha de inicio no puede ser menor a la fecha actual');
    }

    if(folderId && folderId !== 0 && folderId !== '0') {
        const folderIdVal =  validationZod({ id: folderId }, idSchema).id;
        return await findStatisticsByFolder(start, end, folderIdVal, folderName || 'TODOS');
    }

    return await findAllStatistics(start, end);
}

export const verifyIfExists =  async(props: VerifyIfExitsprops) => {

    const creditDb = await Repository.credit.verifyIfExits(props);

    if(!creditDb) {
        throw ServerError.badRequest('No existe el crédito');
    }
}


export default{ 
    additional,
    calculateOverdueCredits,
    calculateWeeks,
    create,
    deleteOne,
    exportLayout,
    exportData,
    findAll,
    findByPreviousCreditId,
    findCreditToPay,
    findCurrentWeek,
    findDetailsCredit,
    findFoldersByClient,
    findGroupsByFolder,
    findOverdueCredits,
    getDefaultStatistics,
    isOverdueCredit,
    renovate,
    updateCreditByPayment,
    updateOne,
    validationToAdditional,
    validationToCreate,
    validationToRenovate,
    verifyAvalCurp,
    verifyClientCurp,
    verifyToCreate,
    verifyIfExists
}