import { ServerError } from "~/.server/errors";
import { FolderI } from "./folder.entity";
import dayjs from 'dayjs';

export interface LeaderI {
    id: number,
    fullname: string,
    curp: string,
    address: string,
    anniversaryDate: Date,
    folder: FolderI,
    isActive: boolean
}

export class Leader {
    
    public readonly id: number;
    public readonly fullname: string;
    public readonly curp: string;
    public readonly address: string;
    public readonly anniversaryDate: string;
    public readonly folder: FolderI;
    public readonly isActive: boolean;

    private constructor({
        id,
        fullname,
        curp,
        address,
        anniversaryDate,
        folder,
        isActive,
    }: Leader) {
        this.id = id;
        this.fullname = fullname;
        this.curp = curp;
        this.address = address;
        this.anniversaryDate = anniversaryDate;
        this.folder = folder;
        this.isActive = isActive;
    }

    static mapper(leaders: Partial<LeaderI>[]) {
        return leaders.map(Leader.create);
    }

    static create(leader: Partial<LeaderI>) {

        const  {
            id,
            fullname,
            curp,
            address,
            anniversaryDate,
            folder,
            isActive,
        } = leader;

        if(!fullname || typeof fullname !== 'string' ) throw ServerError.badRequest('El nombre es requerido');
        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(!curp || typeof curp !== 'string' ) throw ServerError.badRequest('El CURP es requerido');
        if(!address || typeof address !== 'string' ) throw ServerError.badRequest('La dirección es requerido');
        if(!anniversaryDate || !(anniversaryDate instanceof Date) ) throw ServerError.badRequest('La fecha de cumpleños es requerido');
        if(!folder || !folder.name ) throw ServerError.badRequest('La carpeta es requerida');
        if( typeof isActive !== 'boolean' ) throw ServerError.badRequest('La estatus es requerido');
        const anniversaryDateFormatted = dayjs(anniversaryDate).add(1, 'day').format('YYYY-MM-DD'); 


        return new Leader({
            id,
            fullname,
            curp,
            address,
            anniversaryDate: anniversaryDateFormatted,
            folder,
            isActive
        })

    }


}