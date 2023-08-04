import { Schema } from "mongoose";
import uuid = require('uuid');
export const UserSchema = new Schema({
    name: String,
    username: String,
    password: String,
    birthday: Date,
    phone: { type: String, default: '' },
    quote: { type: String, default: '' },
    relation: { type: String, default: 'Single' },
    avatar: String,
    contacts: [],
    requests: [],
    notifications: [],
}, { versionKey: false });