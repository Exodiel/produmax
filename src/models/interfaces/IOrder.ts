import { Document } from 'mongoose';
import { IUser } from './IUser';
export interface IOrder extends Document {
    address: string;
    neigh: string;
    state: string;
    total: number;
    clientId: IUser['_id'];
}