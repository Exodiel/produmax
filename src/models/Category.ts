import { Schema, model } from "mongoose";
import { ICategory } from "./interfaces/ICategory";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

export default model<ICategory>('Category', categorySchema);