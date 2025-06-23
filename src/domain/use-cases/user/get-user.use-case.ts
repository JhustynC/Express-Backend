import { UserEntity } from "../../entities/user.entity";
import { AbsUserRepository } from "../../repositories/user.repository";

export class GetUser {
    constructor(public readonly repository: AbsUserRepository){}

    async execute(email: string): Promise<UserEntity | undefined>{
        return await this.repository.getByEmail(email);
    }
}