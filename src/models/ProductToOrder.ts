import { Schema, model } from 'mongoose';
import { IProductToOrder } from './interfaces/IProductToOrder';


const schema = new Schema({
    productId: {
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    quantity: {
        type: Number,
        required: true
    }
});

export default model<IProductToOrder>('ProductToOrder', schema);