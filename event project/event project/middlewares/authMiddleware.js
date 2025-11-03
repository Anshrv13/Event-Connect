import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import rateLimit from "express-rate-limit"

export const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.uid
        if(!token) return res.status(401).send("Unauthorized - No Token Provided")
            
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return res.status(401).send("Unauthorized - Invalid Token")
            
        const user = await User.findById(decoded.userID).select("-password")
        if(!user) return res.status(401).send("User not found")
        
        req.user = user
        next()
    }catch(error){
        console.log("Error in protectRoute middleware: ",error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkLoggedIn = (req,res,next) => {
    try {
        const token = req.cookies.uid
        
        if(token) return res.redirect("/api/auth/home")
        
        next()
    } catch (error) {
        console.log("Error in checkLoggedIn middleware: ",error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests from this IP, please try again later",
  });