import { z } from 'zod';
import { Status } from '@/domain/enums/Status.enum';

/**
 * @openapi
 * components:
 *   schemas:
 *     Status:
 *       type: string
 *       enum: [Active, Inactive]
 *       description: Status of the person record
 *       example: Active
 *
 *     PersonInput:
 *       type: object
 *       required:
 *         - name
 *         - favoriteFood
 *         - favoriteMovie
 *       properties:
 *         name:
 *           type: string
 *           description: The person's unique name.
 *           example: 'Jane Doe'
 *         favoriteFood:
 *           type: string
 *           description: Their preferred food.
 *           example: 'Tacos'
 *         favoriteMovie:
 *           type: string
 *           description: Their preferred movie.
 *           example: 'The Matrix'
 *         status:
 *           # Use oneOf or anyOf if needed, but direct ref is often fine for enums
 *           $ref: '#/components/schemas/Status'
 *           description: Initial status (defaults to Active if omitted).
 *
 *     PersonBase: # Define base properties separately for clarity
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: cuid
 *           description: Unique identifier for the person.
 *           example: clwymm7tv00017onp643pdxq5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated.
 *
 *     Person: # Combine PersonInput and PersonBase for the full Person model
 *       allOf:
 *         - $ref: '#/components/schemas/PersonBase'
 *         - $ref: '#/components/schemas/PersonInput'
 *         - type: object # Need to explicitly list status again if required/different from input
 *           properties:
 *             status:
 *               $ref: '#/components/schemas/Status'
 *
 *     ActivePersonOutput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: 'Matt'
 *         favoriteMovie:
 *           type: string
 *           example: 'The Princess Bride'
 *         retrievedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the active person data was retrieved.
 *
 *     ApiResponseSuccess: # Generic success wrapper
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *     ApiResponseError: # Generic error response
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: 'Resource not found'
 *         errors:
 *           type: object
 *           description: Validation errors map (optional)
 *           additionalProperties: # Allows arbitrary keys (field names) with string array values
 *             type: array
 *             items:
 *               type: string
 *           example: { "name": ["String must contain at least 1 character(s)"] }
 *         stack:
 *           type: string
 *           description: Error stack trace (only in development environment)
 *
 *     GetPersonsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             count:
 *               type: integer
 *               example: 5
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *
 *     GetActivePersonsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               nullable: true
 *               description: Optional message, e.g., when no records are found.
 *               example: "No active records found."
 *             count:
 *               type: integer
 *               example: 2
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivePersonOutput'
 *
 *     CreatePersonResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponseSuccess'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Person'
 */
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