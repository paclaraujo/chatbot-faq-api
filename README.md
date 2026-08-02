# FAQ Chatbot with Analytics Dashboard — API

A REST API that answers frequently asked questions through a simple chatbot and exposes an analytics dashboard tracking usage metrics (matched/unmatched questions, top FAQs, unanswered questions, category distribution, and a timeline of interactions).

## Architecture

The project follows a layered, module-based architecture built with **Express** and **TypeScript**, using **Prisma ORM** for PostgreSQL access.

```
src/
├── app.ts                  # Express app setup (middlewares, routes, Swagger UI)
├── server.ts                # Entry point — starts the HTTP server
├── database/
│   └── prisma.ts            # Prisma Client instance (pg adapter)
├── middlewares/
│   └── auth.middleware.ts   # JWT authentication middleware
├── routes/
│   ├── index.ts              # Route aggregator
│   └── health.routes.ts      # Health check endpoint
└── modules/
    ├── auth/                 # Login and JWT issuance
    ├── chat/                 # Chatbot: ask a question / view history
    ├── faq/                  # FAQ CRUD (protected)
    └── analytics/             # Dashboard metrics (protected)
```

Each module follows the same **controller → service → repository** pattern:

- **Routes** — define the Express endpoints for the module.
- **Controllers** — handle HTTP request/response and input validation.
- **Services** — contain the business logic.
- **Repositories** — encapsulate Prisma queries.
- **DTOs** — describe request payload shapes.

Database access is centralized through Prisma, with the schema defined in [`prisma/schema.prisma`](prisma/schema.prisma) (models: `User`, `FAQ`, `Interaction`).

## Requirements

- [Node.js](https://nodejs.org/) 20+
- [PostgreSQL](https://www.postgresql.org/) database (a connection string is enough — see [Prisma Postgres](https://www.prisma.io/postgres) for a free hosted option)
- npm

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

   This also runs `prisma generate` automatically via `postinstall`.

2. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="1d"
   PORT=3001

   # Used only by the seed script to create the admin user
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="change-me"
   ```

3. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

4. **Seed the admin user** (optional, required to log in)

   ```bash
   npm run seed
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`.

## Available scripts

| Script                 | Description                                   |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`            | Start the server in watch mode (`tsx`)         |
| `npm run build`          | Compile TypeScript to `dist/`                  |
| `npm start`              | Run the compiled server (`dist/server.js`)     |
| `npm run seed`           | Seed the admin user into the database          |
| `npm test`               | Run the test suite once (Vitest)               |
| `npm run test:watch`     | Run tests in watch mode                        |
| `npm run test:coverage`  | Run tests with coverage report                 |

## API documentation

Interactive Swagger UI docs are served at [`/docs`](http://localhost:3001/docs) once the server is running, generated from [`openapi.json`](openapi.json).

Main endpoints:

| Method | Path              | Auth | Description                       |
| ------ | ----------------- | ---- | ---------------------------------- |
| GET    | `/`                | No   | Health check                       |
| POST   | `/auth/login`      | No   | Authenticate and receive a JWT     |
| POST   | `/chat`             | No   | Ask a question to the chatbot      |
| GET    | `/chat/history`    | No   | List chat interaction history      |
| GET    | `/faq`              | Yes  | List FAQs                          |
| POST   | `/faq`              | Yes  | Create a FAQ                       |
| PATCH  | `/faq/:id`          | Yes  | Update a FAQ                       |
| DELETE | `/faq/:id`          | Yes  | Delete a FAQ                       |
| GET    | `/analytics`        | Yes  | Retrieve dashboard metrics          |

Protected routes require an `Authorization: Bearer <token>` header, using the token returned by `/auth/login`.

## Deployment

This project is configured to deploy via [Prisma Compute](https://www.prisma.io/docs/postgres/compute) (see [`prisma.compute.ts`](prisma.compute.ts)).
