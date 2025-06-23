import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UpdateUserDto } from "../dtos/user/update-user.dto";
import { UserEntity } from "../entities/user.entity";

//? Rules
export abstract class AbsUserDatasource {
    abstract saveUser(user: CreateUserDto): Promise<UserEntity>;
    abstract getByEmail(email: string): Promise<UserEntity | undefined>;
    abstract getAll(): Promise<UserEntity[]>;
    abstract updateUser(user: UpdateUserDto): Promise<UserEntity | undefined>;
    abstract deleteUser(email: string): Promise<UserEntity>;
}