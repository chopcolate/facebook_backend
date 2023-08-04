import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
    members: [],
    messages: [],
}, {  versionKey: false })