import request from 'supertest';
import { Express } from 'express';
import { createServer } from '@/infrastructure/web/server';
import prisma from '@/infrastructure/database/prisma';
import { Status as PrismaStatus } from '@prisma/client';
import { createDependencies } from '@/main';

if (process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be set to "test" for integration tests.');
}

describe('Person API Routes (/api/v1/persons)', () => {
    let app: Express;
    let server: any;

    beforeAll(async () => {
        await prisma.$connect();
        await prisma.person.deleteMany({});

        await prisma.person.createMany({
            data: [
                { name: 'TestActive', favoriteFood: 'Test Food A lol', favoriteMovie: 'Test Movie A lol', status: PrismaStatus.Active },
                { name: 'TestInactive', favoriteFood: 'Test Food B lel', favoriteMovie: 'Test Movie B lel', status: PrismaStatus.Inactive },
                { name: 'TestActive2', favoriteFood: 'Test Food C', favoriteMovie: 'Test Movie C', status: PrismaStatus.Active },
            ],
        });

        const { personController } = createDependencies(); // Use real dependencies
        app = createServer(personController);
    });

    afterAll(async () => {
        await prisma.person.deleteMany({});
        await prisma.$disconnect();
    });

    describe('GET /api/v1/persons/active', () => {
        it('should return only active persons with correct fields', async () => {
            const response = await request(app).get('/api/v1/persons/active');
            const now = new Date();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(2);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toHaveProperty('name');
            expect(response.body.data[0]).toHaveProperty('favoriteMovie');
            expect(response.body.data[0]).toHaveProperty('retrievedAt');
            expect(response.body.data[0]).not.toHaveProperty('id');
            expect(response.body.data[0]).not.toHaveProperty('status');
            expect(new Date(response.body.data[0].retrievedAt).getTime()).toBeCloseTo(now.getTime(), -3);
        });

        it('should sort active persons by name ascending', async () => {
            const response = await request(app).get('/api/v1/persons/active?sortBy=name&sortOrder=asc');

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);
            expect(response.body.data[0].name).toBe('TestActive');
            expect(response.body.data[1].name).toBe('TestActive2');
        });

        it('should sort active persons by name descending', async () => {
            const response = await request(app).get('/api/v1/persons/active?sortBy=name&sortOrder=desc');

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);
            expect(response.body.data[0].name).toBe('TestActive2');
            expect(response.body.data[1].name).toBe('TestActive');
        });


        it('should return empty array and message if no active persons exist', async () => {
            await prisma.person.deleteMany({ where: { status: PrismaStatus.Active }});

            const response = await request(app).get('/api/v1/persons/active');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('No active records found.');
            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);

            await prisma.person.create({ data: { name: 'TestActive wieder', favoriteFood: 'Food', favoriteMovie: 'Movie', status: PrismaStatus.Active }});
        });
    });

    describe('GET /api/v1/persons', () => {
        it('should return all persons (active and inactive)', async () => {
            await prisma.person.upsert({ where: { name: 'TestInactive'}, update: {}, create: { name: 'TestInactive', favoriteFood: 'Test Food B', favoriteMovie: 'Test Movie B', status: PrismaStatus.Inactive }});


            const response = await request(app).get('/api/v1/persons');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBeGreaterThanOrEqual(2);
            expect(response.body.data.some((p: any) => p.status === 'Active')).toBe(true);
            expect(response.body.data.some((p: any) => p.status === 'Inactive')).toBe(true);
            expect(response.body.data[0]).toHaveProperty('id');
            expect(response.body.data[0]).toHaveProperty('status');
            expect(response.body.data[0]).not.toHaveProperty('retrievedAt');
        });

        it('should filter persons by status=Active', async () => {
            const response = await request(app).get('/api/v1/persons?status=Active');
            expect(response.status).toBe(200);
            expect(response.body.data.every((p: any) => p.status === 'Active')).toBe(true);
            expect(response.body.count).toBeGreaterThanOrEqual(1);
        });

        it('should filter persons by status=Inactive', async () => {
            const response = await request(app).get('/api/v1/persons?status=Inactive');
            expect(response.status).toBe(200);
            expect(response.body.data.every((p: any) => p.status === 'Inactive')).toBe(true);
            expect(response.body.count).toBeGreaterThanOrEqual(1);
        });
    });

    describe('POST /api/v1/persons', () => {
        it('should create a new person successfully', async () => {
            const newPersonData = {
                name: 'New Person Test ' + Date.now(),
                favoriteFood: 'New Food',
                favoriteMovie: 'New Movie',
            };
            const response = await request(app)
                .post('/api/v1/persons')
                .send(newPersonData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                ...newPersonData,
                status: 'Active' // Check default status
            });
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('createdAt');

            const dbPerson = await prisma.person.findUnique({ where: { name: newPersonData.name }});
            expect(dbPerson).not.toBeNull();
            expect(dbPerson?.favoriteFood).toBe(newPersonData.favoriteFood);
        });

        it('should return 400 if required fields are missing', async () => {
            const incompleteData = { name: 'Incomplete Test' };
            const response = await request(app)
                .post('/api/v1/persons')
                .send(incompleteData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.errors).toHaveProperty('favoriteFood');
            expect(response.body.errors).toHaveProperty('favoriteMovie');
        });

        it('should return 409 (or similar error) if name is duplicated', async () => {
            const existingName = 'Duplicate Test Name';
            await prisma.person.create({ data: { name: existingName, favoriteFood: 'Food', favoriteMovie: 'Movie', status: PrismaStatus.Active }});

            const duplicateData = {
                name: existingName,
                favoriteFood: 'Another Food',
                favoriteMovie: 'Another Movie',
            };
            const response = await request(app)
                .post('/api/v1/persons')
                .send(duplicateData);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain(`Person with name "${existingName}" already exists.`);
        });
    });

});