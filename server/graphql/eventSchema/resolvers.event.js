import { getAllEvents, getOneEvent } from "../../controllers/adminController.js"
import { addEvent, deleteEvent, editEvent, getAllUserEvent, updateApplicationStatus, applyEvent, getUserAppliedEvents } from "../../controllers/eventManagerController.js"

const req = {}
const res = {
    status: (statusCode) => {
        return {
            json: (data) => {
                return { statusCode, data }
            }
        }
    }
}

const Query = {
    events: async () => {
        const events = await getAllEvents(req,res)
        if(events.statusCode === 200) return events.data
        else throw new Error(events.data.message)
    },
    event: async (_, { id }) => {
        const req = { params: { id }}
        const event = await getOneEvent(req,res)
        if(event.statusCode === 200) return event.data
        else throw new Error(event.data.message)
    },
    userEvents: async (_, {userID}) => {
        const req = { user: { _id: userID}}
        const userEvents = await getAllUserEvent(req, res)
        if(userEvents.statusCode === 200) return userEvents.data
        else throw new Error(userEvents.data.message)
    },
    userAppliedEvents: async (_, {userID}) => {
        const req = { params: { id: userID }}
        const appliedEvents = await getUserAppliedEvents(req,res)
        if(appliedEvents.statusCode === 200) return appliedEvents.data
        else throw new Error(appliedEvents.data.message) 
    }
}

const Mutation = {
    createEvent: async (_, {title, description, type, location, host, totalDays, workHours, payRate, startDate, endDate, roles, image}) => {
        req.body = { title, description, type, location, host, totalDays, workHours, payRate, startDate, endDate, roles, image }
        const event = await addEvent(req,res)
        if(event.statusCode === 200) return event.data
        else throw new Error(event.data.message)
    },
    editEvent: async (_, { eventID, title, description, type, location, totalDays, workHours, payRate, startDate, endDate, roles}) => {
        req.body = { title, description, type, location, totalDays, workHours, payRate, startDate, endDate, roles}
        req.params = {id: eventID}

        const event = await editEvent(req,res)
        if(event.statusCode === 200) return event.data
        else throw new Error(event.data.message)
    },
    deleteEvent: async (_, {eventID}) => {
        req.params = { id: eventID }
        const event = await deleteEvent(req,res)
        if(event.statusCode === 200) return event.data
        else throw new Error(event.data.message)
    },
    updateApplicationStatus: async (_, {eventID, role, applicantID, status}) => {
        const req = {body: {eventID, role, applicantID, status }}
        const updatedStatus = await updateApplicationStatus(req, res)
        if(updatedStatus.statusCode === 200) return updatedStatus.data
        else throw new Error(updatedStatus.data.message)
    },
    applyEvent: async (_, {eventID, role, applicantID}) => {
        const req = { body: { eventID, role, applicantID }}
        const event = await applyEvent(req, res)
        if(event.statusCode === 200) return event.data
        else throw new Error(event.data.message)
    }
}

export const resolvers = { Query, Mutation }
