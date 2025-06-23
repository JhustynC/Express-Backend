import { error } from "console";
import { AbsUserRepository } from "../../domain/repositories/user.repository";
import { GetUser } from "../../domain/use-cases/user/get-user.use-case";
import { GetUsers } from "../../domain/use-cases/user/get-users.use-case";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { CreateUser } from "../../domain/use-cases/user/create-user.use-case";
import { RequestHandler } from "express";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";
import { UpdateUser } from "../../domain/use-cases/user/update-user.use-case";
import { emitWarning } from "process";
import { DeleteUser } from "../../domain/use-cases/user/delete-user.use-caset";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserModel } from "../../config/data/mongo/models/user.model";
import { checkPassword } from "../../shared/helpers/checkPassword.helper";

export class UserController {
    constructor(private readonly userRepository: AbsUserRepository){}

    public getUser: RequestHandler = (req, res) => {
        //? Get necessary data from query params
        const {email} = req.params;
        
        //? We use the specific use-case
        new GetUser(this.userRepository)
        .execute(email)
        .then((user) => res.json(user))
        .catch((error) => res.status(500).json({error: error.message}));
    }
    
    public getUsers:RequestHandler = (req, res) => {
        //? We use the specific use-case
        new GetUsers(this.userRepository)
        .execute()
        .then((users) => res.json(users))
        .catch((error) => res.status(500).json({error: error.message}));
    }

    public createUser:RequestHandler = (req, res) => {
        const [error, user] = CreateUserDto.create(req.body);
        
        if(error){
            res.status(400).json({error});
            return;
        }

        new CreateUser(this.userRepository)
        .execute(user!)
        .then((user) => res.json(user))
        .catch((error) => res.status(404).json({error: error.message}));
    }

    public updateUser: RequestHandler = (req, res) => {
        const { email } =  req.params;
        const obj = {...req.body, email: email};
        const [error, user] = UpdateUserDto.create(obj);

        if(error){
            res.status(400).json({error});
            return;
        }

        new UpdateUser(this.userRepository)
        .execute(user!)
        .then((user) => res.json(user))
        .catch((error) => res.status(404).json({error: error.message}));
    }

    public deleteUser: RequestHandler = (req, res) => {
        const {email} = req.params;

        new DeleteUser(this.userRepository)
        .execute(email)
        .then((user) => res.json(user))
        .catch((error) => res.status(404).json({error: error.message}));
    }

    public checkPassword: RequestHandler = async (req, res) => {
        try{
            const { email } = req.params;
            const { password } = req.body;
            const user = await UserModel.findOne({email});

            if(!user){
                res.status(404).json({error: 'User not found'});
                return;
            }
            
            const userEntity = UserEntity.fromObject(user);
            const checkResult= await checkPassword(userEntity.password, password);
            res.status(200).json({checkResult});
        }catch(error){ 
            res.status(500).json({error: error.message});
        }
    }
}