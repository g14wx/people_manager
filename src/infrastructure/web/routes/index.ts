import { Router } from 'express';
import { createPersonRoutes } from './person.routes';
import { PersonController } from '../controllers/PersonController';

export const createApiRouter = (personController: PersonController): Router => {
    const router = Router();

    router.use('/persons', createPersonRoutes(personController));

    router.get('/health', (req, res) => {
        res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
    });

    return router;
};