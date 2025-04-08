import { Request, Response, NextFunction } from 'express';
import { CreatePersonUseCase } from '@/application/use-cases/CreatePerson.usecase';
import { GetAllPersonsUseCase } from '@/application/use-cases/GetAllPersons.usecase';
import { GetActivePersonsUseCase } from '@/application/use-cases/GetActivePersons.usecase';
import { CreatePersonSchema, GetPersonsQuerySchema } from '@/application/dtos/person.dto';
import { Status } from '@/domain/enums/Status.enum';
import logger from '@/infrastructure/logging/logger';

export class PersonController {
    constructor(
        private createPersonUseCase: CreatePersonUseCase,
        private getAllPersonsUseCase: GetAllPersonsUseCase,
        private getActivePersonsUseCase: GetActivePersonsUseCase
    ) {}

    async createPerson(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body);
            const createPersonInput = CreatePersonSchema.parse(req.body);
            const newPerson = await this.createPersonUseCase.execute(createPersonInput);
            res.status(201).json({ success: true, data: newPerson });
        } catch (error) {
            next(error);
        }
    }

    async getAllPersons(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const queryParams = GetPersonsQuerySchema.parse(req.query);
            const options = {
                sortBy: queryParams.sortBy,
                sortOrder: queryParams.sortOrder,
                status: queryParams.status,
            };

            const persons = await this.getAllPersonsUseCase.execute(options);
            res.status(200).json({ success: true, count: persons.length, data: persons });
        } catch (error) {
            next(error);
        }
    }

    async getActivePersons(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sortBy, sortOrder } = GetPersonsQuerySchema.pick({ sortBy: true, sortOrder: true }).parse(req.query);
            const options = { sortBy, sortOrder };

            const activePersons = await this.getActivePersonsUseCase.execute(options);

            if (activePersons.length === 0) {
                logger.info('No active person records found.'); // Log info
                res.status(200).json({ success: true, message: 'No active records found.', count: 0, data: [] });
            } else {
                res.status(200).json({ success: true, count: activePersons.length, data: activePersons });
            }
        } catch (error) {
            next(error);
        }
    }
}