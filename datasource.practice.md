# For practise

To demonstrate how easy it is to add a new datasource implementation using Clean Architecture, we'll first add this new service in `docker-compose.yml`.

## Adding PostgreSQL Service

To add PostgreSQL to your project, simply add the postgres service to your `docker-compose.yml`:

```yml
services:
  postgres:
    image: postgres:latest
    ports:
      - 5433:5432
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: chat_app_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Don't forget to add the volume for the new postgres service in the volumes declaration section.

## Configuring Prisma with PostgreSQL

To use Prisma ORM with PostgreSQL in your Clean Architecture project, follow these steps:

### 1. Install Prisma
```bash
npm install prisma @prisma/client
```

### 2. Initialize Prisma
```bash
npx prisma init
```

### 3. Configure the `.env` file
Create or update the `.env` file in your project root:
```
POSTGRES_URL="postgresql://root:root@localhost:5433/chat_app_db?schema=public&timezone=America/Guayaquil"
```

### 4. Configure `schema.prisma`
Update the `prisma/schema.prisma` file:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}

model User {
  id       Int      @id @default(autoincrement())
  username String
  email    String   @unique
  password String
  lastSeen DateTime @default(now())
}
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Create database tables
```bash
npx prisma migrate dev --name init
```

### 7. Create PostgreSQL configuration
Create `src/config/data/postgres/postgres.config.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

class PostgresConfig {
    private static instance: PrismaClient;

    public static getInstance(): PrismaClient {
        if (!PostgresConfig.instance) {
            PostgresConfig.instance = new PrismaClient();
        }
        return PostgresConfig.instance;
    }

    public static async disconnect(): Promise<void> {
        if (PostgresConfig.instance) {
            await PostgresConfig.instance.$disconnect();
        }
    }
}

export const prisma = PostgresConfig.getInstance();
export default PostgresConfig;
```

### 8. Create PostgreSQL datasource implementation
Create `src/infrastructure/datasources/postgres.datasource.imp.ts`:
```typescript
import { prisma } from "../../config/data/postgres/postgres.config";
import { AbsUserDatasource } from "../../domain/datasources/user.datasource";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

export class PostgresUserDatasourceImp implements AbsUserDatasource {

    async saveUser(user: CreateUserDto): Promise<UserEntity> {
        const newUser = await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
            }
        });
        return UserEntity.fromObject(newUser);
    }

    async getByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) return undefined;
        return UserEntity.fromObject(user);
    }

    async getAll(): Promise<UserEntity[]> {
        const users = await prisma.user.findMany();
        return users.map((user) => UserEntity.fromObject(user));
    }

    async updateUser(user: UpdateUserDto): Promise<UserEntity | undefined> {
        const currentEmail = user.email;
        const newEmail = user.newEmail;

        // Check if new email is already in use
        if (newEmail && newEmail !== currentEmail) {
            const exist = await this.getByEmail(newEmail);
            if (exist) throw new Error("The new email is already in use");
        }

        const updateData: any = {};
        if (user.username) updateData.username = user.username;
        if (newEmail) updateData.email = newEmail;
        if (user.password) updateData.password = user.password;
        updateData.lastSeen = new Date();

        const updatedUser = await prisma.user.update({
            where: { email: currentEmail },
            data: updateData
        });

        if (!updatedUser) return undefined;
        return UserEntity.fromObject(updatedUser);
    }

    async deleteUser(email: string): Promise<UserEntity> {
        const deletedUser = await prisma.user.delete({
            where: { email }
        });
        if (!deletedUser) throw new Error("Something happened while attempting to delete data");
        return UserEntity.fromObject(deletedUser);
    }
}
```

### 9. Troubleshooting common issues

**Error: "@prisma/client did not initialize yet"**
- Run `npx prisma generate` to regenerate the client
- Make sure your `.env` file has the correct `POSTGRES_URL`
- Verify that PostgreSQL container is running

**Error: "Authentication failed"**
- Check that the credentials in your `.env` match those in `docker-compose.yml`
- Ensure the port number is correct (5433 in this example)
- Restart containers with `docker compose down -v && docker compose up -d`

---

