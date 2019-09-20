import { Document } from "mongoose";
import { IRol } from "./IRol";

export interface IUser extends Document {
    ci: string;
    name: string;
    lastname: string;
    age: number;
    email: string;
    password: string;
    phone: string;
    rolId: IRol['_id'];
}