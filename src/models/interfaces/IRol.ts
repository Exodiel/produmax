import { Document } from "mongoose";

export interface IRol extends Document {
    name: string;
    type_user: number;
}