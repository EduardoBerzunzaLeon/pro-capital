
import dayjs from "dayjs";

export const parseArray = (value: string) => {
    let valueParsed = value
    ? JSON.parse(value+'')
    : 'notUndefined';
    
    if(!Array.isArray(valueParsed)) {
        valueParsed = 'notUndefined';
    }

    return valueParsed;
}

export const parseBoolean = (value: string) => {

    let valueParsed = parseArray(value);

    if(valueParsed.length === 1) {
        valueParsed = Boolean(valueParsed[0]);
    }

    valueParsed = valueParsed.length === 1 
        ? Boolean(valueParsed[0])
        : 'notUndefined'

    return valueParsed;
}

export const parseRangeDate = (start: string, end: string) => {
    return (!start || !end) 
    ? ''
    : {
      start: dayjs(start+'T00:00:00.000Z').toDate(),
      end: dayjs(end).toDate()
    }
}

export const parseNumber =  (value: string) => {
    if(value === '') return '';
    const valueFormatted = Number(value);
    return (isNaN(valueFormatted)) ? 0 : valueFormatted;
} 


export const parseRangeInt = (value: string) => {
    const parsed = value
      ? JSON.parse(value)
      : '';

    let newValue: string 
        | { start: number, end: number } = '';  

    if(Array.isArray(parsed) && parsed.length === 2) {
        newValue = {
            start: Number(parsed[0]),
            end: Number(parsed[1])
        }
    }

    return newValue;
       
}
