import { UserEntity } from "../../entities/user.entity";
import { AbsUserRepository } from "../../repositories/user.repository";

export class GetUsers {
    constructor(public readonly repository: AbsUserRepository){}

    async execute(): Promise<UserEntity[]>{
        return await this.repository.getAll();
    }
}