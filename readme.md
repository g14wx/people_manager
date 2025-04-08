# People manager

requirements:
- node 18.0 (upwards)
- postgres 16.0 (upwards)

Optional (But recommended):
- docker 27.3.1
- docker-compose 2.29.7

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
2. For Development, create a .env.development file
```bash
cp .env.example .env.development
```

e.g
```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@dev-db:5432/peoplemanager_dev?schema=public"
```

if you are using docker, please make sure (if you have a postgres db running in your host) is not running due to, its using the same port 5432

3. Start developing
```bash
docker-compose up dev-app dev-db
```
