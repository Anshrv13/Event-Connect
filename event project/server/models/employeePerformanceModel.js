import { Schema, model } from "mongoose";

const employeePerformanceSchema = new Schema({
  employeeID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventID: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,  
  },
  feedback: {
    type: String,
    required: true,
  }
}, { timestamps: true }); 

const EmployeePerformance = model("EmployeePerformance", employeePerformanceSchema);

export default EmployeePerformance;
