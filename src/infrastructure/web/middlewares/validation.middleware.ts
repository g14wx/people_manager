import {Request, Response, NextFunction} from 'express';
import {AnyZodObject, ZodError} from 'zod';

export const validateRequest = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.method === 'POST') {
                await schema.parseAsync(req.body);
            } else {
                await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    };