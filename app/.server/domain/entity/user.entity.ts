export interface UserI {
    id: number,
    email: string,
    name: string,
    lastNameFirst: string,
    username: string,
    password: string,
    lastNameSecond: string | null,
}

export class User {

    readonly id: number;
    readonly email: string;
    readonly name: string;
    readonly lastNameFirst: string;
    readonly username: string;
    readonly password: string;
    readonly lastNameSecond?: string;

    constructor({
        id,
        email,
        name,
        lastNameFirst,
        username,
        password,
        lastNameSecond
    }: UserI){
        this.id = id;
        this.email = email;
        this.name = name;
        this.lastNameFirst = lastNameFirst;
        this.username = username;
        this.password = password;
        this.lastNameSecond = this.validateLastNameLast(lastNameSecond);
    }


    private validateLastNameLast(lastNameLast: string | null) {
        return lastNameLast || undefined
    }

}