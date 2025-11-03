import express from "express"
import { login, logout, signup } from "../controllers/authController.js"
import { checkLoggedIn, limiter, protectRoute } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/signup", checkLoggedIn, (req, res) => {
    res.render("signup",{isSignupActive: "active", isLoginActive: ""});  // Renders the signup.ejs view
});

router.get("/login", checkLoggedIn, (req, res) => {
    res.render("signup",{isSignupActive: "", isLoginActive: "active"});  // Renders the signup.ejs view
});

router.post("/signup", checkLoggedIn, limiter, signup)
router.post("/login", checkLoggedIn, limiter, login)

router.get("/logout", logout)
router.get("/home", protectRoute,(req,res)=>{
    res.render("homepage")
    // console.log(req.ip) // ip of the user
})

export default router