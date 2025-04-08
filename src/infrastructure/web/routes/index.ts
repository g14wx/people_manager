import { Router } from 'express';
import { createPersonRoutes } from './person.routes';
import { PersonController } from '../controllers/PersonController';

export const createApiRouter = (personController: PersonController): Router => {
    const router = Router();

    router.use('/persons', createPersonRoutes(personController));

    /**
     * @openapi
     * /health:
     *   get:
     *     tags: [Health]
     *     summary: Health check endpoint
     *     description: Returns the current status and timestamp of the API.
     *     responses:
     *       '200':
     *         description: API is healthy.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: UP
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     */
    router.get('/health', (req, res) => {
        res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
    });

    return router;
};