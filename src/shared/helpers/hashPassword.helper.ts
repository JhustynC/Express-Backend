import {hash} from "@node-rs/argon2";

export async function createHash(password: string): Promise<string>{
    const options = {
        type: "argon2id" as const,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parellelism: 2,
        hashLength: 12,
    };

    return await hash(password, options);
}