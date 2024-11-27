
interface ConcatFullnameProps { 
    name: string, 
    lastNameFirst: string, 
    lastNameSecond?: string 
}

export const concatFullname = ({ name, lastNameFirst, lastNameSecond }: ConcatFullnameProps) => {
    const nameTrim = name.trim();
    const lastNameFirstTrim = lastNameFirst.trim();
    const fullName = `${nameTrim} ${lastNameFirstTrim}`;
    
    if(!lastNameSecond) {
      return fullName;
    }
  
    const lastNameSecondTrim = lastNameSecond.trim();
    return `${fullName} ${lastNameSecondTrim}`;
}

export const generateString = (length: number) =>{
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export default {
    concatFullname,
    generateString
}