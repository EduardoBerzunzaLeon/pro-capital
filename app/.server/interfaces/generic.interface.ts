export type GenericUnknown = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Generic =  Record<string, any>;
export type RequestId =  number | string | undefined;
export interface RequestDataGeneric  {
    form: FormData,
    id: RequestId
}

export interface Autocomplete {
    id: number;
    value: string;
}