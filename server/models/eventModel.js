import { Schema, SchemaType, model } from "mongoose";

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required:true
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  host: {
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  workHours: {
    type: Number,
    required: true,
  },
  payRate: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  roles: {
    type: [
      {
        _id: false, // This is to prevent Mongoose from creating an _id field for each role object, which is unnecessary and also i didnt like it lol
        role: {
          type: String,
          required: true,
        },
        selected: {
          type: Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        applicants: [
          {
            status: {
              type: String,
              enum: ["pending", "accepted", "rejected"],
              default: "pending",
            },
            applicant: {
              type: Schema.Types.ObjectId,
              ref: "User",
              default: null
            },
            appliedAt: {
              type: Date,
              default: Date.now
            }
          }
        ]
      }
    ],
    required: true,
  },
  image: {
    type: String
  }
},
{ timestamps: true });

eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.title = this.title.toLowerCase();
  }
  if (this.isModified('location')) {
    this.location = this.location.toLowerCase();
  }
  if (this.isModified('roles')){
    this.roles = this.roles.map(roleObj => ({
      ...roleObj,
      role: roleObj.role.toLowerCase(),
    }))
  }
  next();
});

const Event = model("Event", eventSchema);

export default Event;
