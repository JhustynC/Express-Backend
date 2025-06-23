import {verify} from '@node-rs/argon2';

export async function checkPassword(storeHash: string, password: string){
    return await verify(storeHash, password);
}