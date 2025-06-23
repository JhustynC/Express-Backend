import { MongoOIDCError } from './../../../../../node_modules/mongodb/src/error';
import mongoose from "mongoose";
import { createHash } from "../../../../shared/helpers/hashPassword.helper";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    lastSeen: {type: Date, default: Date.now()},
});

userSchema.pre('save', async function(next){
    if(this.isModified && this.isModified("password")){
        this.password = await createHash(this.password);
    }
    next();
});

userSchema.pre('findOneAndUpdate', async function (next){
    const update:any = this.getUpdate();

    if(update?.password){
       update.password =  await createHash(update.password); 
    }
    if(update?.$set?.password){
       update.$set.password =  await createHash(update.$set.password); 
    }
    next();
});

export const UserModel = mongoose.model("User", userSchema);