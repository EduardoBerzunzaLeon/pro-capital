export interface HandlerSuccess<T> {
    status: string,
    serverData: T,
    error: null | string
}
