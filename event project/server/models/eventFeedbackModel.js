import { Schema, model } from "mongoose";

const eventFeedbackSchema = new Schema({
    eventID: {
        type: Schema.Types.ObjectId,
        ref: "Event", 
        required: true,
    },
    userID: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1, 
        max: 5, 
    },
    comments: {
        type: String,
        required: false,
    }
},
{ timestamps: true, });

const EventFeedback = model("EventFeedback", eventFeedbackSchema);

export default EventFeedback;
