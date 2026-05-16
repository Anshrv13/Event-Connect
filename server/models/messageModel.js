import { Schema, model } from "mongoose"

const messageSchema = new Schema({
    content:{ type: String, required: false },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: [Schema.Types.ObjectId], ref: "User", required: true },
    type: { type: String, enum: ["direct", "group"], default: "direct", required:true },
    deleted: {
        deleteForSender: {type: Boolean, default: false},
        deleteForReceiver: {type: Boolean, default: false},
        deleteForAll: {type: Boolean, default: false}
    },
    media: {
        // url: { type: String },
        type: { type: String, enum: ['image', 'video', 'file'] },
        size: { type: Number },
        originalName: { type: String },
        newName: { type: String }
    },
    seen: [{ type: Schema.Types.ObjectId, ref: "User" }]
},
{ timestamps: true }
)

const Message = model("Message", messageSchema);

export default Message;