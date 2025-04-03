import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import Envs from "@/constants/envs";

const nodeEnv = process.env.NODE_ENV || Envs.DEVELOPMENT;
const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
dotenv.config({ path: envPath });

const EnvSchema = z.object({
    NODE_ENV: z.enum([Envs.DEVELOPMENT, Envs.TEST, Envs.PRODUCTION]),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().url(),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']).default('info'),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        'Invalid:',
        parsedEnv.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables.');
}

export const config = parsedEnv.data;

if (config.NODE_ENV !== Envs.TEST) {
    console.log(`Environment: ${config.NODE_ENV}`);
    // TODO: remove this line later
    console.log(`${config.DATABASE_URL.substring(0, config.DATABASE_URL.indexOf(':'))}`); // comment this later
}