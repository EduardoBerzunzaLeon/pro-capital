import dayjs from 'dayjs';

import { ServerError } from "~/.server/errors"
import { PaymentStatus } from "~/.server/interfaces"

interface AgentI {
    id: number,
    avatar: string,
    fullName: string
}

interface SimplePersonI {
    fullname: string,
    curp: string
}

interface Name {
    name: string,
}

interface CreditFolderI extends Name {
    town: {
        name: string,
        municipality: Name
    },
    route: Name
}

interface CreditPaymentI {
    currentDebt: number,
    client: SimplePersonI,
    aval: SimplePersonI,
    group: Name,
    folder: CreditFolderI
}

export interface PaymentI {
    id: number,
    agent: AgentI,
    paymentAmount: number,
    paymentDate: Date,
    captureAt: Date,
    folio: number,
    notes: string,
    status: PaymentStatus,
    credit: CreditPaymentI
}

export class Payment {
    public readonly id: number;
    public readonly agent: AgentI;
    public readonly paymentAmount: number;
    public readonly paymentDate: string;
    public readonly captureAt: string;
    public readonly folio?: number;
    public readonly notes: string;
    public readonly status: PaymentStatus;
    public readonly credit: CreditPaymentI;

    private constructor({
        id,
        agent,
        paymentAmount,
        paymentDate,
        captureAt,
        folio,
        notes,
        status,
        credit,
    }: Payment) {
        this.id = id;
        this.agent = agent;
        this.paymentAmount = paymentAmount;
        this.paymentDate = paymentDate;
        this.captureAt = captureAt;
        this.folio = folio;
        this.notes = notes;
        this.status = status;
        this.credit = credit;
    }

    static mapper(payments: Partial<PaymentI>[]) {
        return payments.map(Payment.create);
    }

    static create(payment: Partial<PaymentI>) {
        const {
            id,
            agent,
            paymentAmount,
            paymentDate,
            captureAt,
            folio,
            notes,
            status,
            credit,
        } =  payment;

        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(!paymentAmount) throw ServerError.badRequest('La cantidad de pago es requerida');
        if(!paymentDate || !(paymentDate instanceof Date)) throw ServerError.badRequest('La fecha de pago es requerida');
        if(!captureAt || !(captureAt instanceof Date)) throw ServerError.badRequest('La fecha de captura es requerida');
        if(!notes) throw ServerError.badRequest('Las notas es requerida');
        if(!status) throw ServerError.badRequest('El estatus es requerida');
        if(!credit) throw ServerError.badRequest('El crédito es requerida');
        if(!credit.folder) throw ServerError.badRequest('La carpeta es requerida');
        if(!credit.group?.name) throw ServerError.badRequest('El grupo es requerido');
        if(!credit.folder.town) throw ServerError.badRequest('La localidad es requerida');
        if(!credit.folder.route) throw ServerError.badRequest('La ruta es requerida');
        if(!credit.folder.town.municipality) throw ServerError.badRequest('El municipio es requerido');
        if(!credit.aval || !credit.aval.fullname) throw ServerError.badRequest('El aval es requerida');
        if(!credit.client || !credit.client.fullname) throw ServerError.badRequest('el client es requerida');
        if(!agent?.fullName) throw ServerError.badRequest('El agente es requerido');
        const captureAtFormatted = dayjs(captureAt).add(1, 'day').format('YYYY-MM-DD'); 
        const paymentDateFormatted = dayjs(paymentDate).add(1, 'day').format('YYYY-MM-DD'); 
        credit.folder.route.name = `Ruta ${credit.folder.route.name}`;
        credit.group.name = `Grupo ${credit.group.name}`;


        return {
            id,
            agent,
            paymentAmount,
            paymentDate: paymentDateFormatted,
            captureAt: captureAtFormatted,
            folio: folio ?? '',
            notes,
            status,
            credit
        }
    }

}