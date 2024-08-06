interface UserI {
    id: number,
    email: string,
    name: string,
    lastNameFirst: string,
    userName: string,
    password: string,
    lastNameLast: string | null,
}

export class User {

    readonly id: number;
    readonly email: string;
    readonly name: string;
    readonly lastNameFirst: string;
    readonly userName: string;
    readonly password: string;
    readonly lastNameLast?: string;

    constructor({
        id,
        email,
        name,
        lastNameFirst,
        userName,
        password,
        lastNameLast
    }: UserI){
        this.id = id;
        this.email = email;
        this.name = name;
        this.lastNameFirst = lastNameFirst;
        this.userName = userName;
        this.password = password;
        this.lastNameLast = this.validateLastNameLast(lastNameLast);
    }


    private validateLastNameLast(lastNameLast: string | null) {
        return lastNameLast || undefined
    }

}