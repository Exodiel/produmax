import { Schema, model } from "mongoose";
import {IProduct} from "./interfaces/IProduct";

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    stock:{
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    comboPrice:{
        type: Number,
        required:false
    },
    imagePath: {
        type: String,
        required: true
    },
    unit_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Unit'
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
});

export default model<IProduct>('Product',schema);