import express, { Express } from 'express';
import pinoHttp from 'pino-http';
import { errorHandler } from './middlewares/errorHandler';
import logger from '../logging/logger';
import { createApiRouter } from './routes';
import { PersonController } from './controllers/PersonController';
import { swaggerSpec } from '@/config/swagger';
import swaggerUi from 'swagger-ui-express';

export function createServer(personController: PersonController): Express {
    const app = express();
    app.use(pinoHttp({ logger }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(pinoHttp({ logger }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (swaggerSpec) {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        }));

        // Optional: Serve the raw JSON spec
        app.get('/api-docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
        logger.info(`Swagger Docs available at /api-docs`);
    } else {
        logger.warn('Swagger spec not available, skipping /api-docs route setup.');
    }


    const apiRouter = createApiRouter(personController);
    app.use('/api/v1', apiRouter);

    app.use((req, res) => {
        res.status(404).json({ success: false, message: 'Not Found' });
    });

    app.use(errorHandler);

    return app;
}