import 'source-map-support/register';
import { config } from './config';
import logger from './infrastructure/logging/logger';
import { createServer } from './infrastructure/web/server';
import { PrismaPersonRepository } from './infrastructure/database/repositories/PrismaPersonRepository';
import { CreatePersonUseCase } from './application/use-cases/CreatePerson.usecase';
import { GetAllPersonsUseCase } from './application/use-cases/GetAllPersons.usecase';
import { GetActivePersonsUseCase } from './application/use-cases/GetActivePersons.usecase';
import { PersonController } from './infrastructure/web/controllers/PersonController';
import prisma from './infrastructure/database/prisma';

export function createDependencies() {
    const personRepository = new PrismaPersonRepository();

    const createPersonUseCase = new CreatePersonUseCase(personRepository);
    const getAllPersonsUseCase = new GetAllPersonsUseCase(personRepository);
    const getActivePersonsUseCase = new GetActivePersonsUseCase(personRepository);

    const personController = new PersonController(
        createPersonUseCase,
        getAllPersonsUseCase,
        getActivePersonsUseCase
    );

    return {
        personRepository,
        personController,
    };
}

async function bootstrap() {
    try {
        logger.info('application its starting...');

        await prisma.$connect();
        logger.info('Database connected');

        // Instantiate dependencies
        const { personController } = createDependencies();

        // Create Express server instance
        const app = createServer(personController);

        // Start the server
        const server = app.listen(config.PORT, () => {
            logger.info(`Server listening on http://localhost:${config.PORT}`);
            logger.info(`Environment: ${config.NODE_ENV}`);
        });

        const signals = ['SIGINT', 'SIGTERM'];
        signals.forEach((signal) => {
            process.on(signal, async () => {
                logger.info(`Received ${signal}, shutting down...`);
                server.close(async () => {
                    logger.info('HTTP server closed');
                    await prisma.$disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        logger.fatal({ err: error }, 'Failed to start application');
        await prisma.$disconnect().catch(e => logger.error({err: e}, 'Error disconnecting prisma'));
        process.exit(1);
    }
}
bootstrap();