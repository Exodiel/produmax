import { Schema, model } from "mongoose";
import { IUnit } from "./interfaces/IUnit";

const unitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    }
});

export default model<IUnit>('Unit', unitSchema);