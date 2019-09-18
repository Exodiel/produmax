import { Document } from "mongoose";
import { IUnit } from "./IUnit";
import { ICategory } from "./ICategory";

export interface IProduct extends Document {
    name: string;
    details?: string;
    stock: number;
    unitPrice: number;
    comboPrice?: number;
    imagePath: string;
    unit_id: IUnit['_id'];
    category_id: ICategory['_id'];
}