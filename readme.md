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
git clone 
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
7. Start the application
```bash
npm run dev
```

