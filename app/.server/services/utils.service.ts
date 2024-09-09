
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

export default {
    concatFullname
}