import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

export const getAllUserEvent = async (req, res) => {
    try {
        const userID = req.user._id;
        const getEvents = await Event.find({ host: userID })
        .populate("host", "name email")
        .populate({ path: "roles.selected", model: "User",select: "name email role experience", ifNull: "No Applicants Selected" })
        .populate({ path: "roles.applicants.applicant", ref: "User", select: "name _id email role experience", ifNull: "No Applicants" });

        if (getEvents.length === 0) return res.status(200).json({ message: "No Events Created" });
        // req.event = getEvents;
        return res.status(200).json(getEvents)
    } catch (error) {
        console.log("Error in getAllUserEvent Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const getEvents = await Event.find({});
        if (Object.keys(getEvents).length === 0) return res.status(200).json({ message: "No Events Found" });
        return res.status(200).json({ getEvents: getEvents })
    } catch (error) {
        console.log("Error in getAllEvents Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const getOneEvent = async (req, res) => {
    try {
        const eventID = req.params.id;
        const getEventDetails = await Event.findById(eventID);
        if (getEventDetails.length === 0) return res.status(404).json({ message: "Event not found" });
        req.event = getEventDetails;
    } catch (error) {
        console.log("Error in getOneEvent Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const addEvent = async (req, res) => {
    try {
        const { title, description, type, host, location, totalDays, workHours, payRate, startDate, endDate, roles, image } = req.body;

        if( !title || !description || !type || !location || !host || !totalDays || !workHours || !payRate || !startDate || !endDate || !roles ){
            return res.status(400).json({ message: "All fields are required" });
        }

        const newEvent = new Event({
            title,
            description,
            type,
            location,
            host,
            totalDays,
            workHours,
            payRate,
            startDate,
            endDate,
            roles,
            image
        });

        await newEvent.save();
        return res.status(200).json(newEvent);
    } catch (error) {
        console.log("Error in addEvent Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const editEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, type, location, totalDays, workHours, payRate, startDate, endDate, roles} = req.body;
        if(!eventId) return res.status(400).json({ message: "Event id is required"})

        if( !title || !description || !type || !location || !eventId || !totalDays || !workHours || !payRate || !startDate || !endDate || !roles ){
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedEventData = {
            title,
            description,
            type,
            location,
            totalDays,
            workHours,
            payRate,
            startDate,
            endDate,
            roles, 
            // image
        };

        const event = await Event.findByIdAndUpdate(eventId, updatedEventData, { new: true });
        if (!event) return res.status(404).json({ message: "Event not found" });

        return res.status(200).json(event);
    } catch (error) {
        console.log("Error in editEvent Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        return res.status(200).json(event);
    } catch (error) {
        console.log("Error in deleteEvent Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const getNearByEmployees = async (req, res) => {
    try {
        const location = req.user.location || "asdad"
        const nearBy = await User.find({ location, role: { $nin: ["event manager", "admin"]} }).select("-password -createdAt -updatedAt");
        if (nearBy.length === 0) return res.status(404).json({ message: "No near by employees found" });

        return res.status(200).json({ message: `employees near by: ${nearBy}` });
    } catch (error) {
        console.log("Error in getNearByEmployees Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const updateApplicationStatus = async (req,res) => {
    try {
        const { eventID, role, applicantID, status } = req.body;
        if(!eventID || !role || !applicantID || !status) return res.status(400).json({ message: "All fields are required" });

        const event = await Event.findById(eventID);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const user = await User.findById(applicantID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const roleIndex = event.roles.findIndex(r => r.role === role);
        if (roleIndex === -1) return res.status(404).json({ message: "Role not found" });

        const applicantIndex = event.roles[roleIndex].applicants.findIndex(a => a.applicant == applicantID);
        if (applicantIndex === -1) return res.status(404).json({ message: "applicant not found" });

        if(status === "accepted"){ 
            event.roles[roleIndex].applicants[applicantIndex].status = status;
            event.roles[roleIndex].selected = applicantID
            await event.save(); 
            return res.status(200).json(event);
        }
        
        event.roles[roleIndex].applicants[applicantIndex].status = status;
        await event.save();
        return res.status(200).json(event);
    } catch (error) {
        console.log("Error in updateApplicationStatus Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const applyEvent = async (req,res) => {
    try {
        const { eventID, role, applicantID } = req.body;
        if(!eventID || !role || !applicantID) return res.status(400).json({ message: "All fields are required" });

        const event = await Event.findById(eventID);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const user = await User.findById(applicantID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const addApplicant = event.roles.findIndex(r => r.role === role);
        if (addApplicant === -1) return res.status(404).json({ message: "Role not found" });
        const exist = event.roles[addApplicant].applicants.find(a => a.applicant == applicantID)
        if(exist) return res.status(400).json({ message: "You have already applied for this role" });

        event.roles[addApplicant].applicants.push({ applicant: applicantID, status: "pending" });
        await event.save();

        return res.status(200).json(event);
    } catch (error) {
        console.log("Error in applyEvent Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const getUserAppliedEvents = async (req,res) => {
    try {
        const userID = req.params.id
        const appliedEvents = await Event.find({ "roles.applicants.applicant": userID})
        .populate("host", "name email id")
        .populate("roles.applicants.applicant", "name email id")

        if (!appliedEvents) {
            return res.status(404).json({ message: "No events found" });
        }
        return res.status(200).json(appliedEvents);
    } catch (error) {
        console.log("Error in getUserAppliedEvents Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}