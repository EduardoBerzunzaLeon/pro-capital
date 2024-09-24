
import dayjs from "dayjs";

export const parseBoolean = (value: string) => {

    let valueParsed = value
        ? JSON.parse(value+'')
        : 'notUndefined';

    if(!Array.isArray(valueParsed)) {
        valueParsed = 'notUndefined';
    }

    if(valueParsed.length === 1) {
        valueParsed = Boolean(valueParsed[0]);
    }

    valueParsed = valueParsed.length === 1 
        ? Boolean(valueParsed[0])
        : 'notUndefined'

    return valueParsed;
}

export const parseRangeDate = (field: string, start: string, end: string) => {
    return (!start || !end) 
    ? { column: field, value: ''}
    : { column:  field, value: {
      start: dayjs(start+'T00:00:00.000Z').toDate(),
      end: dayjs(end).toDate()
    }}
}