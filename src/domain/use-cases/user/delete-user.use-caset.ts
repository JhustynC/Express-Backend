import { UserEntity } from "../../entities/user.entity";
import { AbsUserRepository } from "../../repositories/user.repository";

export class DeleteUser {
    constructor(public readonly repository: AbsUserRepository){}

    async execute(email: string): Promise<UserEntity>{
        return await this.repository.deleteUser(email);
    }
}