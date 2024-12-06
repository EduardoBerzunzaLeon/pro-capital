export class ServerError extends Error {

    public readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }

    static badRequest(message: string) {
        return new ServerError(message, 400);
    }
    
    static unauthorized(message: string) {
        return new ServerError(message, 401);
    }
    
    static forbidden(message: string) {
        return new ServerError(message, 403);
    }
    
    static notFound(message: string) {
        return new ServerError(message, 404);
    }
    
    static notAllowed(message: string) {
        return new ServerError(message, 405);
    }
    
    static internalServer(message: string) {
        return new ServerError(message, 500);
    }

    static upgradeRequired(message: string) {
        return new ServerError(message, 426);
    }

}