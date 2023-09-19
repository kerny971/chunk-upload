export default class HttpError extends Error {

    statusCode: number = 200;

    constructor (statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

}