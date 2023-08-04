import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
    name: string,
    birthday: Date,
    username: string,
    password: string,
    avatar: string,
    phone: string,
    quote: string,
    relation: string,
    contacts: [],
    requests: [],
    notifications: [],
}