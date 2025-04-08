# People manager

requirements:
- node 18.0 (upwards)
- postgres 16.0 (upwards)

Optional (But recommended):
- docker 27.3.1
- docker-compose 2.29.7

I recommend using docker for development, but if you want to run it locally, you can do it too.

## Setup
1. Clone the repository
```bash
git clone https://github.com/g14wx/people_manager.git
```
2. Install dependencies
```bash
cd people-manager && npm install
```
3. Create a `.env` file in the root directory and add the following environment variables:
```bash
cp .env.example .env
```
info
- `DATABASE_URL`: The URL of the PostgreSQL database. (e.g. `postgres://user:password@localhost:5432/people-manager`)

4. Create a PostgreSQL database (you choose the name of the db, but please make sure you update the `DATABASE_URL` in the `.env` file accordingly)

6. Create and Seed the database with some initial data
```bash
npm run db:migrate:dev && npm run db:seed
```
7. Before running the application, make sure to start the PostgreSQL server, and create a new .env.development file

```shell
cp .env .env.development
````
7. Start the application
```bash
npm run dev:ts-node
```

### Run tests
1. Make sure to have the database running
2. Create a new .env.test file
```bash
touch .env.test
```
make sure that it has the correct variables for you env to run the tests

e.g

````dotenv
NODE_ENV=test
PORT=3001
DATABASE_URL="postgresql://test_user:test_password@test-db:5432/peoplemanager_test?schema=public"
````
Make sure you are running it in a safe place that doesnt interfere with your dev db or prod db, or even better you can use a sqlite db for testing (SQLite was not tested with this project)

3. Run the tests
```bash
npm run test
```


# Docker setup (Recommended) 

1. Clone the repository
```bash
git clone https://github.com/g14wx/people_manager.git
```
2. For Development, create a .env.development, .env.test, .env.production files
```bash
touch .env.development && touch .env.test && touch .env.production
```

e.g (.env.development)
```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@dev-db:5432/peoplemanager_dev?schema=public"
```

e.g (.env.test)
```dotenv
NODE_ENV=test
PORT=3001
DATABASE_URL="postgresql://test_user:test_password@test-db:5432/peoplemanager_test?schema=public"
```

e.g (.env.production)
```dotenv
NODE_ENV=production
PORT=8080
DATABASE_URL="postgresql://prod_user:prod_password@prod_db_host:5432/peoplemanager?schema=public"
LOG_LEVEL=info
```

if you are using docker, please make sure (if you have a postgres db running in your host) is not running due to, its using the same port 5432

#### Start developing
```bash
docker-compose up dev-app dev-db
```

(Optionality, if you want to run this in the background, you can add the -d flag)

```bash

if something is not working, you can try to build the images again
````bash
docker-compose up --build dev-app dev-db
````

#### Start testing 
```bash
docker-compose run --rm test-runner
```


To kill everything you can run
```bash
docker-compose down -v
```


# FAQ

If you want to explore all the endpoints, try swagger
```bash
http://localhost:3000/api-docs
```

# Final notes
## Technology Stack & Key Decisions

This project utilizes a modern and robust technology stack chosen for development speed, reliability, and ease of use.

* **ORM: Prisma**
    * Selected for its exceptional developer experience, type safety, and ease of getting started.
    * Prisma simplifies database interactions and provides auto-generated types, significantly speeding up development while reducing runtime errors.
    * Its capabilities cover the essential needs of an ORM effectively.

* **Database: PostgreSQL**
    * Chosen to mirror real-world production environments, offering robust features and data integrity.
    * Prisma integrates seamlessly with PostgreSQL.

* **Web Framework: Express.js**
    * Serves as the foundation for the REST API.
    * Valued for its minimalist core and immense flexibility, allowing developers to build tailored solutions without being overly opinionated.
    * Its vast ecosystem and large community provide extensive resources and support, making it a reliable choice for building scalable applications.

* **Testing: Jest & Supertest**
    * **Jest:** Employed as the primary framework for unit and integration testing, known for its simplicity and powerful assertion capabilities.
    * **Supertest:** Used specifically for testing HTTP endpoints, enabling straightforward and readable API tests.
    * This combination facilitates Test-Driven Development (TDD) and ensures code reliability with a low barrier to entry for developers.

* **API Documentation: Swagger (OpenAPI)**
    * Integrated using `swagger-ui-express` and `swagger-jsdoc`.
    * Provides interactive API documentation, allowing developers and consumers to easily explore and test the available endpoints directly from the browser (typically available at `/api-docs`).

* **Continuous Integration: GitHub Actions**
    * A CI pipeline is configured using GitHub Actions to automatically build, lint, and run tests on every push and pull request.
    * Ensuring the pipeline passes is a critical quality gate before any code review or merge, maintaining project stability and code quality.

## Deployment Considerations

This application is built with containerization (Docker) and standard Node.js practices, making it suitable for various deployment environments.

* It is designed to be deployed to VPS environments or Platform-as-a-Service (PaaS) providers.
* Common deployment strategies could involve using raw Nginx as a reverse proxy, or leveraging tools like Nginx Proxy Manager, Dokploy, or **Coolify** for simplified management on a Virtual Private Server (VPS).
* Setting up a full CI/CD pipeline to automate deployment following successful CI checks is the recommended approach for production environments.

## Future Improvements
* **Authentication & Authorization**: Implement user authentication and role-based access control (RBAC) to secure endpoints and manage user permissions.
* **Rate Limiting**: Introduce rate limiting to prevent abuse of the API and ensure fair usage.
* **Caching**: Implement caching strategies (e.g., Redis) to improve performance for frequently accessed data.
* **Error Handling**: Enhance error handling and logging mechanisms for better observability and debugging.
* **Monitoring & Alerting**: Integrate monitoring tools (e.g., Prometheus, Grafana) to track application performance and set up alerts for critical issues.
* **Documentation**: Expand API documentation and provide usage examples for better developer experience.
* **Testing Coverage**: Increase test coverage, especially for edge cases and error scenarios.
* **Code Quality**: Implement code quality tools (e.g., ESLint, Prettier) to maintain consistent coding standards and style.