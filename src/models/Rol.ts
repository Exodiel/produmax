import { Schema, model } from "mongoose";
import {IRol} from "./interfaces/IRol";

const rolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type_user: {
        type: Number,
        required: true
    }
});

export default model<IRol>('Rol', rolSchema);