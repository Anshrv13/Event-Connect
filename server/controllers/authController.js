import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/utils.js"

export const signup = async (req,res) => {
    try{
        const {fullName, email, phno, role, password, confirmPassword} = req.body

        if(!fullName || !email || !phno || !role || !password || !confirmPassword) return res.status(400).json({message: "All fields are required" });
        
        if(password.length < 8 || confirmPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long" });

        if(password.length > 20 || confirmPassword.length > 20) return res.status(400).json({message: "Password must not exceed 20 characters" })
         
        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match!" });

        const isUser = await User.findOne({ $or: [{email} , {phno}] })

        if(isUser) return res.status(400).json({ message: "Email or phone number already exists" });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            name: fullName,
            email: email,
            phno,
            password: hashedPassword,
            role: role.toLowerCase(),
        })

        await newUser.save()
        res.status(201).json({ message: "/api/auth/login"});
    }catch(error){
        console.log("Error in Signup Controller: ",error)
        return res.status(500).json({ message:"Internal server Error" })
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})  // .select("-password")  //.select(["-password","-role","-phno"])  .select("-password -role -phno")
        if(!user) return res.status(400).json({ message: "Email does not exist" })

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" })
        
        generateToken(user._id, user.role, res)
        return res.status(200).json({ name: user.name, email:user.email ,role: user.role })
    }catch(error){
        console.log("Error in login Controller: ",error)
        return res.status(500).json({ message:"Internal server Error" })
    }
}

export const logout = async (req,res) => {
    try {
        await User.findByIdAndUpdate(req.user._id,{ $set:{ isActive: false }}, { new: true }).select("-password")
        res.clearCookie('uid', { path: '/' });
        res.status(200).json({ message:"success" });
    } catch (error) {
        console.log("Error in logout Controller: ",error)
        return res.status(500).json({ message:"Internal server Error" })
    }
}

export const userInfo = (req,res) => {
    try {
        const user = req.user
        if(!user) return res.status(400).json({ message: "user does not exist" })
        return res.status(200).json({ id: user._id,name: user.name, email: user.email, role: user.role, location: user.location });
    } catch (error) {
        console.log("Error in userInfo Controller: ",error)
        return res.status(500).json({ message:"Internal server Error" })
    }
}
