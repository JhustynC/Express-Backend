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