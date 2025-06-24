# Backend-review

This project is a RESTful API built with Node.js, Express, and TypeScript, using MongoDB as the database. It allows for user management, including creation, retrieval, updating, deletion, and password verification.

## Main Features

- **RESTful API** for user management.
- **MongoDB** as the database, initialized via Docker.
- **TypeScript** for improved robustness and maintainability.
- **Password hashing and verification** using Argon2.
- **Environment variables** for flexible configuration.
- **API Documentation** with Swagger.

## Folder Structure

- `src/` - Main source code.
  - `config/` - Database and plugin configuration.
  - `domain/` - Entities, DTOs, use cases, and repositories.
  - `infrastructure/` - Implementations of repositories and datasources.
  - `presentation/` - Routes, controllers, and Express server.
  - `shared/` - Reusable helpers.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) and Docker Compose

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend-review
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root with the following content (adjust if necessary):
   ```
   PORT=3000
   MONGO_URL=mongodb://root:root@localhost:27018/chat_app_db?authSource=admin
   MONGO_DB_NAME=chat_app_db
   ```

## Running the Project

1. **Start the server in development mode**
   ```bash
   npm run dev
   ```
   The server will start and automatically connect to the database.

## API Documentation (Swagger)

Once the server is running, you can access the interactive API documentation at:

[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

From this interface, you can view all available endpoints, test them, and see the expected data models.

## Main Endpoints

All user endpoints are under the `/user` prefix:

- `GET    /user/`           → List all users
- `GET    /user/:email`     → Get user by email
- `POST   /user/`           → Create user (body: user data)
- `PUT    /user/:email`     → Update user (body: data to update)
- `DELETE /user/:email`     → Delete user
- `POST   /user/:email`     → Verify password (body: `{ password }`)

There is also a test endpoint at `/api`.

## Notes

- The project uses Argon2 for password hashing.
- The MongoDB container is initialized with the username and password `root`.
- You can modify ports and credentials in `docker-compose.yml` and `.env`.

