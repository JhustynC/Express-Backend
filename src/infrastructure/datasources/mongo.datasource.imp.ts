import { UserModel } from "../../config/data/mongo/models/user.model";
import { AbsUserDatasource } from "../../domain/datasources/user.datasource";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

export class MongoDatasourceImp implements AbsUserDatasource{
    async saveUser(user: CreateUserDto): Promise<UserEntity> {
        const newUser = await UserModel.create(user);
        return UserEntity.fromObject(newUser);
    }
    async getByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await UserModel.findOne({email: email});
        if(!user) return undefined;
        return UserEntity.fromObject(user);
    }
    async getAll(): Promise<UserEntity[]> {
        const user = await UserModel.find();
        return user.map((u) => UserEntity.fromObject(u));
    }
    async updateUser(user: UpdateUserDto): Promise<UserEntity | undefined> {
        
        //! Get 
        const currentEmail = user.email;
        const newEmail = user.newEmail;

        //! The new email doesn't be same to currentEmail
        if(newEmail && newEmail !== currentEmail){
            const exist = await this.getByEmail(newEmail);
            // const exist = await UserModel.findOne({email: newEmail});
            if(exist) throw new Error("The new email is alredy in use");
        }

        const updateFields: {[key:string]: any} = {...user.values};

        console.log('Type of user.password:', typeof user.password, user.password);

        const updatedUser =  await UserModel.findOneAndUpdate(
            { email: currentEmail },
            { $set: updateFields },
            { new: true }
        );

        if(!updatedUser) return undefined;
        return UserEntity.fromObject(updatedUser);
    }

    async deleteUser(email: string): Promise<UserEntity> {
        const deleteUser =  await UserModel.findOneAndDelete({email});
        if(!deleteUser) throw new Error("Something happens while It was attempted delete data");
        return UserEntity.fromObject(deleteUser);
    }
}