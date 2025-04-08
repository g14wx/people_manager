import { z } from 'zod';
import { Status } from '@/domain/enums/Status.enum';

export const CreatePersonSchema = z.object({
    name: z.string().min(1, "Name is required"),
    favoriteFood: z.string().min(1, "Favorite food is required"),
    favoriteMovie: z.string().min(1, "Favorite movie is required"),
    status: z.nativeEnum(Status).optional().default(Status.Active),
});

export type CreatePersonInput = z.infer<typeof CreatePersonSchema>;

export const ActivePersonOutputSchema = z.object({
    name: z.string(),
    favoriteMovie: z.string(),
    retrievedAt: z.date(),
});

export type ActivePersonOutput = z.infer<typeof ActivePersonOutputSchema>;

export const PersonOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    favoriteFood: z.string(),
    favoriteMovie: z.string(),
    status: z.nativeEnum(Status),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type PersonOutput = z.infer<typeof PersonOutputSchema>;

export const GetPersonsQuerySchema = z.object({
    sortBy: z.enum(['name', 'favoriteFood', 'favoriteMovie', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    status: z.nativeEnum(Status).optional(),
});

export type GetPersonsQueryInput = z.infer<typeof GetPersonsQuerySchema>;