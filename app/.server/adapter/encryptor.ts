import bcrypt from 'bcryptjs';

export const compare = (data: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(data, hash)
}

export const hash = (data: string, salt: number | string) => {
    return bcrypt.hash(data, salt);
}

export default {
    compare,
    hash
}