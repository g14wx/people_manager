import { Router } from 'express';
import { PersonController } from '../controllers/PersonController';
import { CreatePersonSchema, GetPersonsQuerySchema } from '@/application/dtos/person.dto';
import { validateRequest } from '../middlewares/validation.middleware';

export const createPersonRoutes = (personController: PersonController): Router => {
    const router = Router();
    router.post(
        '/',
        validateRequest(CreatePersonSchema),
        personController.createPerson.bind(personController)
    );

    router.get(
        '/',
        validateRequest(GetPersonsQuerySchema),
        personController.getAllPersons.bind(personController)
    );

    router.get(
        '/active',
        validateRequest(GetPersonsQuerySchema.pick({ sortBy: true, sortOrder: true })),
        personController.getActivePersons.bind(personController)
    );

    return router;
};