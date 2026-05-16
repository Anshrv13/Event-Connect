import express from "express"
import { allowRole, protectRoute } from "../middlewares/authMiddleware.js"
import { addEvent, deleteEvent, getAllEvents, editEvent, getAllUserEvent, getNearByEmployees, getOneEvent } from "../controllers/eventManagerController.js"

const router = express.Router()

// event routes
router.get("/getAllUserEvent", protectRoute, allowRole(["event manager"]), getAllUserEvent)
router.get("/getAllEvents", protectRoute, allowRole(["event manager"]), getAllEvents)
router.get("/getOneEvent/:id", protectRoute, allowRole(["event manager"]), getOneEvent)
router.post("/addEvent", protectRoute, allowRole(["event manager"]), addEvent)
router.put("/editEvent/:id", protectRoute, allowRole(["event manager"]), editEvent)
router.delete("/deleteEvent/:id", protectRoute, allowRole(["event manager"]), deleteEvent)

// employee route
router.get("/getNearByEmployees", protectRoute, allowRole(["event manager"]), getNearByEmployees)

export default router