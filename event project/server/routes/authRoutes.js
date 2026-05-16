import express from "express"
import { userInfo, login, logout, signup } from "../controllers/authController.js"
import { checkLoggedIn, limiter, protectRoute } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/signup", checkLoggedIn, limiter, signup)
router.post("/login", checkLoggedIn, limiter, login)
router.get("/me", protectRoute, userInfo)
router.get("/logout", protectRoute, logout)

export default router