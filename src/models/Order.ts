import { Schema, model } from 'mongoose';
import { IOrder } from './interfaces/IOrder';
const schema = new Schema({
    address: {
        type: String,
        required: true
    },
    neigh: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

export default model<IOrder>('Order', schema);