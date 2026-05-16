import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js"
import { getFriends, searchQuery, addFriend } from "../controllers/messageController.js"

const router = express.Router()

// router.post("/messages", protectRoute, chatMessage)
router.post("/messages/search", protectRoute, searchQuery)
router.post("/messages/getFriends", protectRoute, getFriends)
// router.post("/messages/getChat", protectRoute, getChat)
router.post("/addFriend", protectRoute, addFriend)

export default router