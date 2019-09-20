import { Document } from 'mongoose';
import { IOrder } from './IOrder';
import { IProduct } from './IProduct';
export interface IProductToOrder extends Document {
    orderId: IOrder['_id'];
    productId: IProduct['_id'];
    quantity: number;
}