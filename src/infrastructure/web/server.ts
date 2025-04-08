import express, { Express } from 'express';
import pinoHttp from 'pino-http';
import { errorHandler } from './middlewares/errorHandler';
import logger from '../logging/logger';
import { createApiRouter } from './routes';
import { PersonController } from './controllers/PersonController';

export function createServer(personController: PersonController): Express {
    const app = express();
    app.use(pinoHttp({ logger }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const apiRouter = createApiRouter(personController);
    app.use('/api/v1', apiRouter);

    app.use((req, res) => {
        res.status(404).json({ success: false, message: 'Not Found' });
    });

    app.use(errorHandler);

    return app;
}