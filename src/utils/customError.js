export const HttpCode = {
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    UNAUTHENTICATED: 403,
    NOT_FOUND: 404,
    CREATED: 201,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    CONFLICT: 409,
};

export class CustomError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export const createCustomError = (message, statusCode) => {
    return new CustomError(message, statusCode);
};
