import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../../logging/logger';
import { ZodError } from 'zod';
import { config } from '@/config';

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, url: req.originalUrl }, 'Unhandled error occurred');

    let statusCode = 500;
    let message = 'Internal Server Error';
    let details: unknown = undefined;

    if (err instanceof ZodError) {
        statusCode = 400; // Bad Request
        message = 'Validation failed';
        details = err.flatten().fieldErrors;
    } else if (err instanceof Error) {
        message = err.message;
        if (config.NODE_ENV !== 'production' || err.name === 'CustomUserFacingError') {
        } else {
            message = 'An unexpected error occurred.'; // Generic message for prod
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(details ? { errors: details } : {}),
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
};