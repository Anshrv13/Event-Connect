import express from "express"
import { protectRoute, allowRole } from "../middlewares/authMiddleware.js"
import * as fn from "../controllers/adminController.js"

const router = express.Router()

router.get("/getAllUsers", protectRoute, allowRole(["admin"]), fn.getAllUsers)
router.get("/getOneUser/:id", protectRoute, allowRole(["admin"]), fn.getOneUser)
router.get("/getActiveUsers", protectRoute, allowRole(["admin"]), fn.getActiveUsers)

router.get("/getAllEvents", protectRoute, allowRole(["admin"]), fn.getAllEvents)
router.get("/getOneEvent/:id", protectRoute, allowRole(["admin"]), fn.getOneEvent)
router.get("/getActiveEvents", protectRoute, allowRole(["admin"]), fn.getActiveEvents)
router.get("/getUpComingEvents", protectRoute, allowRole(["admin"]), fn.getUpComingEvents)

router.get("/getAllEventFeedbacks", protectRoute, allowRole(["admin"]), fn.getAllEventFeedbacks)
router.get("/getOneEventFeedback/:id", protectRoute, allowRole(["admin"]), fn.getOneEventFeedback)

router.get("/getAllContactUs", protectRoute, allowRole(["admin"]), fn.getAllContactUs)
router.get("/getOneContactUs/:id", protectRoute, allowRole(["admin"]), fn.getOneContactUs)
router.get("/getPendingContactUs", protectRoute, allowRole(["admin"]), fn.getPendingContactUs)

router.get("/getAllEmployeePerformance", protectRoute, allowRole(["admin"]), fn.getAllEmployeePerformance)
router.get("/getOneEmployeePerformance/:id", protectRoute, allowRole(["admin"]), fn.getOneEmployeePerformance)

router.get("/getAllHireEmployeeHistory", protectRoute, allowRole(["admin"]), fn.getAllHireEmployeeHistory)
router.get("/getOneHireEmployeeHistory/:id", protectRoute, allowRole(["admin"]), fn.getOneHireEmployeeHistory)
router.get("/getActiveHireEmployeeHistory", protectRoute, allowRole(["admin"]), fn.getActiveHireEmployeeHistory)

export default router