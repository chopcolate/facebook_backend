import { Schema } from "mongoose"

export const OnlineSchema = new Schema({
    username: String,
    socketId: String,
}, { collection: "online", versionKey: false })