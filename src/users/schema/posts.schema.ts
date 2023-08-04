import { Schema, Types } from "mongoose";
import uuid = require('uuid');

export const PostSchema = new Schema({
    author: String,
    content: Object,
    time: Date,
    comments: [],
    loves: [],
}, { versionKey: false });