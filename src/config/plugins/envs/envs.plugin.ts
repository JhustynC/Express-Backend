import * as env from "env-var";
import "dotenv/config"; //? Load environment variables from .env file

export const envs = {
    PORT: env.get("PORT").required().asPortNumber(),
    PROD: env.get("PROD").asBool(),
    
    MONGO_URL: env.get("MONGO_URL").required().asString(),
    MONGO_DB_NAME: env.get("MONGO_DB_NAME").required().asString(),

    POSTGRES_URL: env.get("POSTGRES_URL").required().asString(),
    POSTGRES_DB: env.get("POSTGRES_DB").required().asString(),
    POSTGRES_USER: env.get("POSTGRES_USER").required().asString(),
    POSTGRES_PASSWORD: env.get("POSTGRES_PASSWORD").required().asString(),
}

