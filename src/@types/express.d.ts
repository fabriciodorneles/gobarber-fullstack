declare namespace Express {
    // tá anexando na Request do Express - Overryde
    export interface Request {
        user: {
            id: string;
        };
    }
}
