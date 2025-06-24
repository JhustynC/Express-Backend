import { prisma } from "../../config/data/postgres/postgres.config";
import { AbsUserDatasource } from "../../domain/datasources/user.datasource";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

export class PostgresUserDatasourceImp implements AbsUserDatasource {

    async saveUser(user: CreateUserDto): Promise<UserEntity> {
        const newUser = await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
            }
        });
        return UserEntity.fromObject(newUser);
    }

    async getByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) return undefined;
        return UserEntity.fromObject(user);
    }

    async getAll(): Promise<UserEntity[]> {
        const users = await prisma.user.findMany();
        return users.map((user) => UserEntity.fromObject(user));
    }

    async updateUser(user: UpdateUserDto): Promise<UserEntity | undefined> {
        const currentEmail = user.email;
        const newEmail = user.newEmail;

        // Check if new email is already in use
        if (newEmail && newEmail !== currentEmail) {
            const exist = await this.getByEmail(newEmail);
            if (exist) throw new Error("The new email is already in use");
        }

        const updateData: any = {};
        if (user.username) updateData.username = user.username;
        if (newEmail) updateData.email = newEmail;
        if (user.password) updateData.password = user.password;
        updateData.lastSeen = new Date();

        const updatedUser = await prisma.user.update({
            where: { email: currentEmail },
            data: updateData
        });

        if (!updatedUser) return undefined;
        return UserEntity.fromObject(updatedUser);
    }

    async deleteUser(email: string): Promise<UserEntity> {
        const deletedUser = await prisma.user.delete({
            where: { email }
        });
        if (!deletedUser) throw new Error("Something happened while attempting to delete data");
        return UserEntity.fromObject(deletedUser);
    }

    async disconnect(): Promise<void> {
        await prisma.$disconnect();
    }
} 