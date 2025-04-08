import { Router } from 'express';
import { PersonController } from '../controllers/PersonController';
import { CreatePersonSchema, GetPersonsQuerySchema } from '@/application/dtos/person.dto';
import { validateRequest } from '../middlewares/validation.middleware';

/**
 * @openapi
 * tags:
 *   - name: Persons
 *     description: Persons CRUD
 */
export const createPersonRoutes = (personController: PersonController): Router => {
    const router = Router();

    /**
     * @openapi
     * /persons:
     *   post:
     *     tags: [Persons]
     *     summary: Create a new person
     *     description: Adds a new person record to the database. Status defaults to 'Active' if not provided.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PersonInput'
     *     responses:
     *       '201':
     *         description: Person created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreatePersonResponse'
     *       '400':
     *         description: Validation Error (invalid input). See 'errors' object for details.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponseError'
     *       '409': # Assuming your controller/use case handles this via specific error
     *         description: Conflict - Person with this name already exists.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponseError'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponseError'
     */
    router.post(
        '/',
        validateRequest(CreatePersonSchema),
        personController.createPerson.bind(personController)
    );

    /**
     * @openapi
     * /persons:
     *   get:
     *     tags: [Persons]
     *     summary: Retrieve a list of persons
     *     description: Gets all person records, optionally filtered by status and sorted.
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           $ref: '#/components/schemas/Status'
     *         required: false
     *         description: Filter persons by status (Active or Inactive).
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [name, favoriteFood, favoriteMovie, createdAt, updatedAt]
     *         required: false
     *         description: Field to sort the results by.
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: asc
     *         required: false
     *         description: Sort order (ascending or descending).
     *     responses:
     *       '200':
     *         description: A list of persons.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/GetPersonsResponse'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponseError'
     */
    router.get(
        '/',
        validateRequest(GetPersonsQuerySchema),
        personController.getAllPersons.bind(personController)
    );

    /**
     * @openapi
     * /persons/active:
     *   get:
     *     tags: [Persons]
     *     summary: Retrieve active persons (limited fields)
     *     description: Gets only active persons, returning Name, Favorite Movie, and Retrieval Timestamp. Allows sorting based on original DB fields.
     *     parameters:
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [name, favoriteFood, favoriteMovie, createdAt, updatedAt]
     *         required: false
     *         description: Field to sort the active persons by (based on original DB fields).
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: asc
     *         required: false
     *         description: Sort order (ascending or descending).
     *     responses:
     *       '200':
     *         description: A list of active persons with limited fields. Returns success=true and empty data array if none found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/GetActivePersonsResponse'
     *       '500':
     *         description: Internal Server Error.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponseError'
     */

    router.get(
        '/active',
        validateRequest(GetPersonsQuerySchema.pick({ sortBy: true, sortOrder: true })),
        personController.getActivePersons.bind(personController)
    );

    return router;
};