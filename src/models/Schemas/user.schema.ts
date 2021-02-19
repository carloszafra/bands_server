import { Schema, Document, model} from "mongoose";
import { hash, compare, genSalt } from "bcryptjs";

export interface userI extends Document{
    _id: string,
    name: string,
    email: string,
    password: string,
    online: boolean,
    hashPassword(password: string): Promise<string>,
}

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    online: {type: Boolean, default: false}
});

UserSchema.methods.hashPassword = async (password: string) => {
   const salt = await genSalt(10);
   return await hash(password, salt);
}


export default model<userI>("User", UserSchema);