import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const dtoPath = path.resolve(process.cwd(), 'src/application/dtos/**/*.ts');
const routesPath = path.resolve(process.cwd(), 'src/infrastructure/web/routes/**/*.ts');

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Person Favorites API',
            version: '1.0.0',
            description: 'API documentation for managing people and their favorite things.',
        },
        servers: [
            {
                url: `/api/v1`,
                description: 'Development server (v1)',
            },
        ],
        components: {
            schemas: {},
        },
        tags: [
            {
                name: 'Persons',
                description: 'Operations related to person records'
            },
            {
                name: 'Health',
                description: 'API Health Checks'
            }
        ],
    },
    apis: [dtoPath, routesPath],
};

let generatedSpec;

try {
    generatedSpec = swaggerJsdoc(options);
    console.log('Swagger specification generated successfully.');
} catch (error) {
    console.error('Error generating Swagger specification:', error);
    throw new Error(`Failed to generate Swagger spec: ${error}`);
}

export const swaggerSpec = generatedSpec;