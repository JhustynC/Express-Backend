# For practise

To demonstrate how easy it is to add a new datasource implementation using Clean Architecture, we'll first add this new service in `docker-compose.yml`.

## Schema Database

To have the Postgres service start with a database and its schema (tables) already created—so you don't have to manually run SQL to create tables after the service is up—you can use the initialization scripts feature provided by the official Postgres Docker image.

### Steps:

1. **Create an SQL file with your database schema**  
   For example, create a file named `init.sql` in a folder in your project (e.g., `./postgres-init/init.sql`):

   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Mount the script into the Postgres container**  
   Edit your `docker-compose.yml` to add a volume that mounts the folder containing your script to `/docker-entrypoint-initdb.d/` inside the container.  
   For example:

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
         - ./postgres-init:/docker-entrypoint-initdb.d
   ```

   > **Note:** All `.sql` scripts in `/docker-entrypoint-initdb.d/` are executed automatically the first time the container is created (when the database is empty).

    Don't forget to add the volume for the new postgres service in the volumes declaration section.

    ```yml
    volumes:
      mongo_data:
      postgres_data:
    ```

3. **Restart the service**  
   If you already have the container created, remove it first so the database is recreated and the initialization scripts are executed:

   ```bash
   docker compose down -v
   docker compose up -d
   ```

---

**Summary:**  
Place your table creation scripts in a folder, mount it to `/docker-entrypoint-initdb.d`, and Postgres will automatically execute those scripts the first time the container starts.


