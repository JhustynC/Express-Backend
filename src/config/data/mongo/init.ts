import mongoose from "mongoose";

interface ConnectionMongoOptions{
    url: string,
    dbName: string
}

export class MongoDatabase{
    static async connect(options: ConnectionMongoOptions): Promise<mongoose.Mongoose> {
        const {url, dbName} = options;
        try{
            const mongodb = await mongoose.connect(url, {dbName: dbName});
            console.log("Connect to MongoDb");
            return mongodb;
        }catch(error){
            throw `Error: Failed to connect to MongoDb\n ${error}`;
        }
    }

    static async disconnect(): Promise<void>{
        await mongoose.disconnect();
    }
}