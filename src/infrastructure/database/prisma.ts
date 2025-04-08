import { PrismaClient } from '@prisma/client';
import logger from '../logging/logger';
import { config } from '@/config';

const prisma = new PrismaClient({
    log: config.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    logger.info('Prisma client disconnected on app termination');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    logger.info('Prisma client disconnected on app termination');
    process.exit(0);
});

export default prisma;