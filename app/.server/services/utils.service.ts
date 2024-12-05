import { Generic } from '~/.server/interfaces';

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



export const flatten = (array:  Array<Generic>) => {
    return array.map(obj => flattenObj(obj));
}
const arrayTest = [
    { 
        name: 'eduardo',
        town: {
            name:  'narnia',
            municipality: {
                name: 'wakanda'
            }
        } ,
        route: {
            name: '1'
        },
        leaders: [{
            fullname: 'eduardo berzunza'
        }],
        _count: { groups: 10 }
    },
]

export const flattenObj = (obj:  Generic, key: string = '') => {
    const newObj: Generic = {};
    let newKey = key;
    for (const key in obj) {
        const typeofattr = typeof obj[key];
        if(Array.isArray(obj[key])) {
            // Do something in array properties
        }

        if(typeofattr === 'object' && obj[key] !== null) {
            // Do something with nested objects
            const objNested = flattenObj(obj[key], key);
            
        }

        newKey += (newKey === '') ? key : `_${key}`;

        newObj[newKey] = obj[key];
    }

    return newObj;
}

export default {
    concatFullname,
    generateString
}