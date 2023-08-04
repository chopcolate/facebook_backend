import { Document } from "mongoose";

export interface IPost extends Document {
    author: string,
    content: object,
    time: Date,
    comments: [],
    loves: [],
}