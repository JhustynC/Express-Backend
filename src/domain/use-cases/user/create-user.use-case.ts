import { CreateUserDto } from "../../dtos/user/create-user.dto";
import { UserEntity } from "../../entities/user.entity";
import { AbsUserRepository } from "../../repositories/user.repository";

export class CreateUser {
    constructor(public readonly repository: AbsUserRepository){}

    async execute(dto: CreateUserDto): Promise<UserEntity>{
        return await this.repository.saveUser(dto);
    }
}