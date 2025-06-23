import * as env from "env-var";
import "dotenv/config"; //? Load environment variables from .env file

export const envs = {
    PORT: env.get("PORT").required().asPortNumber(),
    MONGO_URL: env.get("MONGO_URL").required().asString(),
    MONGO_DB_NAME: env.get("MONGO_DB_NAME").required().asString(),
    PROD: env.get("PROD").asBool(),
}

