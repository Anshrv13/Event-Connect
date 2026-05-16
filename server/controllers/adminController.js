import User from "../models/userModel.js"
import Event from "../models/eventModel.js"
import EventFeedback from "../models/eventFeedbackModel.js"
import Contact from "../models/contactModel.js"
import EmployeePerformance from "../models/employeePerformanceModel.js"
import HireEmployee from "../models/hireEmployeeModel.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password -__v").populate("friends")

        if (users.length === 0) return new Error("No Users Found");
            
        if (Object.keys(users).length === 0) return res.status(400).json({ message: "No User Created" })

        return res.status(200).json(users)
    } catch (error) {
        console.log("Error in getUsers Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getOneUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).select("-password").populate("friends")

        if (Object.keys(user).length === 0) return res.status(400).json({ message: "User Not Found" })
        
        return res.status(200).json(user)        
    } catch (error) {
        console.log("Error in getOneUser Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getActiveUsers = async (req, res) => {
    try {
        const user = await User.find({ isActive: true, role: { $ne: "admin" } }).select("-password")

        if (Object.keys(user).length === 0) return res.status(200).json({ message: "No Active User At The Moment" })
        
        return res.status(200).json(user)        
    } catch (error) {
        console.log("Error in getActiveUsers Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}, {"__v": 0}).populate("host", "name email id role experience")
        .populate("roles.selected","name email id role experience")
        .populate("roles.applicants.applicant","name email id role experience")
        if (Object.keys(events).length === 0) return res.status(200).json({ message: "No events found/created" })
        return res.status(200).json(events)
    } catch (error) {
        console.log("Error in getAllEvents Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getActiveEvents = async (req, res) => {
    try {
        const now = new Date()
        const events = await Event.find({ event_start_date: { $lte: now }, event_end_date: { $gte: now } })
        if (Object.keys(events).length === 0) return res.status(200).json({ message: "No Active Events At The Moment" })

        return res.status(200).json(events)
    } catch (error) {
        console.log("Error in getActiveEvents Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getUpComingEvents = async (req, res) => {
    try {
        const now = new Date()
        const events = await Event.find({ event_start_date: { $gte: now } })
        if (Object.keys(events).length === 0) return res.status(200).json({ message: "No Up Coming Events At The Moment" })

        return res.status(200).json(events)
    } catch (error) {
        console.log("Error in getUpComingEvents Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getOneEvent = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findById(id).populate("host")
        if (Object.keys(event).length === 0) return res.status(200).json({ message: "No event Found" })

        return res.status(200).json(event)
    } catch (error) {
        console.log("Error in getOneEvent Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getAllContactUs = async (req, res) => {
    try {
        const contactUs = await Contact.find({})
        if (Object.keys(contactUs).length === 0) return res.status(200).json({ message: "No contact us filled" })

        return res.status(200).json(contactUs)
    } catch (error) {
        console.log("Error in getAllContactUs Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getPendingContactUs = async (req, res) => {
    try {
        const contactUs = await Contact.find({ status: "pending" })
        if (Object.keys(contactUs).length === 0) return res.status(200).json({ message: "No contactUs pending At the Moment" })

        return res.status(200).json(contactUs)
    } catch (error) {
        console.log("Error in getPendingContactUs Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getOneContactUs = async (req, res) => {
    try {
        const id = req.params.id
        const contactUs = await Contact.findById(id)
        if (Object.keys(contactUs).length === 0) return res.status(200).json({ message: "No contactUs Found" })

        return res.status(200).json(contactUs)
    } catch (error) {
        console.log("Error in getOneContactUs Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getAllEventFeedbacks = async (req, res) => {
    try {
        const feedbacks = await EventFeedback.find({})
        if (Object.keys(feedbacks).length === 0) return res.status(200).json({ message: "No Feedbacks Filled" })

        return res.status(200).json(feedbacks)
    } catch (error) {
        console.log("Error in getAllEventFeedbacks Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getOneEventFeedback = async (req, res) => {
    try {
        const id = req.params.id
        const feedback = await EventFeedback.findById(id)
        if (Object.keys(feedback).length === 0) return res.status(200).json({ message: "No contactUs Found" })

        return res.status(200).json(feedback)
    } catch (error) {
        console.log("Error in getOneEventFeedback Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getAllEmployeePerformance = async (req, res) => {
    try {
        const getAllPerformace = await EmployeePerformance.find({})
        if (Object.keys(getAllPerformace).length === 0) return res.status(200).json({ message: "No record found" })

        return res.status(200).json(getAllPerformace)        
    } catch (error) {
        console.log("Error in getAllEmployeePerformance Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getOneEmployeePerformance = async (req, res) => {
    try {
        const employeeID = req.params.id
        const getOnePerformace = await EmployeePerformance.findById(employeeID)
        if (Object.keys(getOnePerformace).length === 0) return res.status(200).json({ message: "No record found" })

        return res.status(200).json(getOnePerformace)
    } catch (error) {
        console.log("Error in getOneEmployeePerformance Controller: ", error)
        return res.status(500).json({ message: "Internal server Error" })
    }
}

export const getAllHireEmployeeHistory = async (req, res) => {
    try {
        const hireHistory = await HireEmployee.find()
            .populate('employer_id', 'name email') 
            .populate('employee_id', 'name email') 
            .populate('event_id', 'event_name');

        if (Object.keys(hireHistory).length === 0) return res.status(200).json({ message: "No record found" })

        return res.status(200).json(hireHistory);
    } catch (error) {
        console.error('Error in getAllHireEmployeeHistory Controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getOneHireEmployeeHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const hireHistory = await HireEmployee.findById(id)
            .populate('employer_id', 'name email')
            .populate('employee_id', 'name email')
            .populate('event_id', 'event_name');

        if (!hireHistory) return res.status(404).json({ message: 'Hiring history not found.' });

        return res.status(200).json(hireHistory);
    } catch (error) {
        console.error('Error in getOneHireEmployeeHistory Controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getActiveHireEmployeeHistory = async (req, res) => {
    try {
        const hireHistory = await HireEmployee.find({ status: "active" })
            .populate('employer_id', 'name email')
            .populate('employee_id', 'name email')
            .populate('event_id', 'event_name');

        if (!hireHistory) return res.status(404).json({ message: 'Hiring history not found.' });

        return res.status(200).json(hireHistory);
    } catch (error) {
        console.error('Error in getActiveHireEmployeeHistory Controller:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
