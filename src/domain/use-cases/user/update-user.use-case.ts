import { UpdateUserDto } from "../../dtos/user/update-user.dto";
import { UserEntity } from "../../entities/user.entity";
import { AbsUserRepository } from "../../repositories/user.repository";

export class UpdateUser {
    constructor(public readonly repository: AbsUserRepository){}

    async execute(dto: UpdateUserDto): Promise<UserEntity | undefined>{
        return await this.repository.updateUser(dto);
    }
}