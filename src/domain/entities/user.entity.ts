
export interface UserOptions{
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly lastSeen: Date | undefined;

}

export class UserEntity {
    username: string;
    email: string;
    password: string;
    lastSeen: Date | undefined;

    constructor({username, email, password, lastSeen}: UserOptions){
        this.username = username;
        this.email = email;
        this.password = password;
        this.lastSeen = lastSeen;
    }

    //? Mapper 
    static fromObject(mongoObject: {[key: string]: any}): UserEntity {
        const {username, email, password, lastSeen} = mongoObject;

        if(!username || !email || !password || !lastSeen){
            throw new Error("More prop are required");
        }

        return new UserEntity({
            username,
            email,
            password,
            lastSeen: lastSeen ? new Date(lastSeen) : new Date(),
        });
    }
}