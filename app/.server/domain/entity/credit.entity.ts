import { ServerError } from "~/.server/errors";
import dayjs from 'dayjs';

interface Person {
    fullname: string,
    address: string,
    reference: string,
    curp: string
}

interface Name {
    name: string,
}

interface CreditFolder extends Name {
    town: {
        name: string,
        municipality: Name
    },
    route: Name
}


export interface CreditI {
    id: number,
    aval: Person,
    client: Person,
    group: Name,
    folder: CreditFolder,
    amount: number,
    paymentAmount: number,
    captureAt: Date,
    creditAt: Date,
    canRenovate: boolean,
    nextPayment: Date,
    lastPayment: Date,
    currentDebt: number,
    status: Status
}

export type Status = 
'ACTIVO' |
'VENCIDO' |
'LIQUIDADO' |
'RENOVADO' |
'FALLECIDO' 

export class Credit {
    public readonly id: number;
    public readonly aval: Person;
    public readonly client: Person;
    public readonly group: Name;
    public readonly folder: CreditFolder;
    public readonly amount: number;
    public readonly paymentAmount: number;
    public readonly captureAt: string;
    public readonly creditAt: string;
    public readonly canRenovate: boolean;
    public readonly nextPayment: string;
    public readonly lastPayment: string;
    public readonly currentDebt: number;
    public readonly status: Status


    private constructor({
        id,
        aval,
        client,
        group,
        folder,
        amount,
        paymentAmount,
        captureAt,
        creditAt,
        canRenovate,
        nextPayment,
        lastPayment,
        currentDebt,
        status,
    }: Credit) {
        this.id =  id;
        this.aval =  aval;
        this.client =  client;
        this.group =  group;
        this.folder =  folder;
        this.amount =  amount;
        this.paymentAmount =  paymentAmount;
        this.captureAt =  captureAt;
        this.creditAt =  creditAt;
        this.canRenovate =  canRenovate;
        this.nextPayment =  nextPayment;
        this.lastPayment =  lastPayment;
        this.currentDebt =  currentDebt;
        this.status =  status;
    }

    static mapper(credits: Partial<CreditI>[]) {
        return credits.map(Credit.create);
    }

    static create(credit: Partial<CreditI>) {

        const {
            id,
            aval,
            client,
            group,
            folder,
            amount,
            paymentAmount,
            captureAt,
            creditAt,
            canRenovate,
            nextPayment,
            lastPayment,
            currentDebt,
            status,
        } = credit;

        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(!amount) throw ServerError.badRequest('La cantidad es requerida');
        if(!paymentAmount) throw ServerError.badRequest('La cantidad de pago es requerida');
        if(!currentDebt) throw ServerError.badRequest('La deuda actual es requerida');
        if(!status) throw ServerError.badRequest('El estatus es requerido');
        if(!captureAt || !(captureAt instanceof Date) ) throw ServerError.badRequest('La fecha de captura es requerida');
        if(!creditAt || !(creditAt instanceof Date) ) throw ServerError.badRequest('La fecha de alta del credito es requerida');
        if(!nextPayment || !(nextPayment instanceof Date) ) throw ServerError.badRequest('La fecha del siguiente pago es requerida');
        if(!lastPayment || !(lastPayment instanceof Date) ) throw ServerError.badRequest('La fecha del ultimo pago es requerida');
        //  TODO: verificar por que retonar  los numeros como objetos al igual que canrenovate
        // if( typeof canRenovate !== 'boolean' ) throw ServerError.badRequest('La estatus es requerido');

        if(!folder) throw ServerError.badRequest('La carpeta es requerida');
        if(!group?.name) throw ServerError.badRequest('El grupo es requerido');
        if(!folder.town) throw ServerError.badRequest('La localidad es requerida');
        if(!folder.route) throw ServerError.badRequest('La ruta es requerida');
        if(!folder.town.municipality) throw ServerError.badRequest('El municipio es requerido');
        if(!aval || !aval.fullname) throw ServerError.badRequest('El aval es requerida');
        if(!client || !client.fullname) throw ServerError.badRequest('el client es requerida');
        const captureAtFormatted = dayjs(captureAt).add(1, 'day').format('YYYY-MM-DD'); 
        const creditAtFormatted = dayjs(creditAt).add(1, 'day').format('YYYY-MM-DD'); 
        const nextPaymentFormatted = dayjs(nextPayment).add(1, 'day').format('YYYY-MM-DD'); 
        const lastPaymentFormatted = dayjs(lastPayment).add(1, 'day').format('YYYY-MM-DD'); 

        folder.route.name = `Ruta ${folder.route.name}`;
        group.name = `Grupo ${group.name}`;

        return new Credit({
            id,
            aval,
            client,
            group: group,
            folder: folder,
            amount,
            paymentAmount,
            captureAt: captureAtFormatted,
            creditAt: creditAtFormatted,
            nextPayment: nextPaymentFormatted,
            lastPayment: lastPaymentFormatted,
            canRenovate: !!canRenovate,
            currentDebt,
            status,
        })

        


    }

}








