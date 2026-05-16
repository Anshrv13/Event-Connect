import { Schema, model } from "mongoose";

const hireEmployeeSchema = new Schema({
  employerID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeID: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  hiredDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  eventID: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    required: true,
    default: 'active',
  },
  role: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const HireEmployee = model("HireEmployee", hireEmployeeSchema);

export default HireEmployee;
