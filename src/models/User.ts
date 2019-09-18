import bcrypt from 'bcrypt';
import { Schema, model, Error } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import {IUser} from "./interfaces/IUser";
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    ci: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    age:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
    rol_id: {
        type: ObjectId,
        required: true,
        ref: 'Rol'
    }
});

schema.pre<IUser>('save', function save(next){
    const user = this;
    bcrypt.hash(user.password, 12, (err: Error, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

schema.plugin(uniqueValidator);

export default model<IUser>('User',schema);