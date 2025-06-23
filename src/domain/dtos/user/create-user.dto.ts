import { UserOptions } from "../../entities/user.entity";

export class CreateUserDto {
    private constructor(
        readonly username: string,
        readonly password: string,
        readonly email: string,
        readonly lastSeen?: Date,
    ){}

    static create(props: Partial<UserOptions>): [string?, CreateUserDto?] {
        const {username, password, email, lastSeen} = props;
        
        //! Validations
        if(!username) return ["Username is required", undefined];
        if(!password) return ["Password is required", undefined];
        if(!email) return ["Email is required", undefined];
        // if(!lastSeen) return ["lastSeen is required", undefined];
        
        return [
            undefined,
            new CreateUserDto(
                username,
                password,
                email,
                lastSeen || new Date()
            )
        ]
    }   

}