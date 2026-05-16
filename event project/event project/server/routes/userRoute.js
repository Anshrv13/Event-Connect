import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js"
import { getSearchResult } from "../controllers/userController.js"

const router = express.Router()

router.post("/search", protectRoute, getSearchResult)

export default router