'use strict';

const HttpStatus = require('http-status-codes')

class ExtendableError extends Error {
    constructor(message) {
        if (new.target === ExtendableError)
            throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.contructor);
    }
}

// 400 Bad Request
class BadRequest extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'BAD_REQUEST'
            });
        else
            super({
                statusCode: HttpStatus.BAD_REQUEST,
                message: m
            });
    }
}

// 401 Unauthorized
class Unauthorized extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'UNAUTHORIZED'
            });
        else
            super({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: m
            });
    }
}

// 403 Forbidden
class Forbidden extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'FORBIDDEN'
            });
        else
            super({
                statusCode: HttpStatus.FORBIDDEN,
                message: m
            });
    }
}

// 404 Not Found
class NotFound extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'NOT_FOUND'
            });
        else
            super({
                statusCode: HttpStatus.NOT_FOUND,
                message: m
            });
    }
}

// 409 Conflict
class Conflict extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.CONFLICT,
                message: 'CONFLICT'
            });
        else
            super({
                statusCode: HttpStatus.CONFLICT,
                message: m
            });
    }
}

// 422 Unprocessable Entity
class UnprocessableEntity extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'UNPROCESSABLE_ENTITY'
            });
        else
            super({
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                message: m
            });
    }
}

// 500 Internal Server Error
class InternalServerError extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'INTERNAL_SERVER_ERROR'
            });
        else
            super({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: m
            });
    }
}

module.exports.BadRequest = BadRequest;
module.exports.Unauthorized = Unauthorized;
module.exports.Forbidden = Forbidden;
module.exports.NotFound = NotFound;
module.exports.Conflict = Conflict;
module.exports.UnprocessableEntity = UnprocessableEntity;
module.exports.InternalServerError = InternalServerError;