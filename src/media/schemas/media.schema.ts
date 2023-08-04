import { Schema } from 'mongoose';


export const MediaSchema = new Schema({
    url: String,
    img: String,
    name: String,
    artist: String,
}, { versionKey: false })