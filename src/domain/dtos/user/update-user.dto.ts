

export class UpdateUserDto {
    private constructor(
        readonly email: string,
        readonly newEmail?: string,
        readonly username?: string,
        readonly password?: string,
        readonly lastSeen?: Date,
    ){}

    public get values(){
        const values: {[key:string]:any} = {};

        if(this.username) values.username = this.username;
        if(this.password) values.password = this.password;
        if(this.newEmail) values.email = this.newEmail;
        if(this.lastSeen) values.lastSeen = this.lastSeen;

        return values;
    }

    static create(props: {[key:string]:any}): [string?, UpdateUserDto?] {
        const {username, email, password, lastSeen, newEmail}= props;

        if(username){
            //? Validations
        }
        if(newEmail){
            //? Validations
        }
        if(password){
            //? Validations
        }

        return [undefined, new UpdateUserDto(email, newEmail, username, password, lastSeen)]
    }
}