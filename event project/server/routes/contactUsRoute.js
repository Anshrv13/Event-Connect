import express from "express"
import Contact from "../models/contactModel.js"

const router = express.Router()

router.post("/contactUs", async (req,res) => {
    try {
        const { name, email, message } = req.body.contact
        if(!name.trim() || !email.trim() || !message.trim()) return res.status(400).json({ message:"all fields required" })
        
        const contact = new Contact({
            name,
            email,
            message: message.trimEnd()
        })
        await contact.save()
        
        return res.status(201).json({ message:"Message submitted" })
    } catch (error) {
        console.log("Error in contactUs Route: ",error)
        return res.status(500).json({ message:"Internal server Error" })
    }
})

export default router