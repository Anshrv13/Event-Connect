import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/utils.js"

export const signup = async (req,res) => {
    try{
        const {name, signupEmail, phno, role, signupPassword, signupCPassword} = req.body

        if(!name || !signupEmail || !phno || !role || !signupPassword || !signupCPassword) return res.status(400).render("signup", { isSignupActive: "active",
            isLoginActive: "", errorMessage: "All fields are required" });
        
        if(signupPassword.length < 8 || signupCPassword.length < 8) return res.status(400).render("signup", {  isSignupActive: "active",
            isLoginActive: "", errorMessage: "Password must be at least 8 characters long" });

        if(signupPassword.length > 20 || signupCPassword.length > 20) return res.status(400).render("signup", {  isSignupActive: "active",
            isLoginActive: "", errorMessage: "Password must not exceed 20 characters" });
         
        if(signupPassword !== signupCPassword) return res.status(400).render("signup", { isSignupActive: "active",
            isLoginActive: "", errorMessage: "Passwords don't match!" });

        const isUser = await User.findOne({ $or: [{signupEmail} , {phno}] })

        if(isUser) return res.status(400).render("signup", { isSignupActive: "active",
            isLoginActive: "", errorMessage: "Email or phone number already exists" });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(signupPassword,salt)

        const newUser = new User({
            name,
            email: signupEmail,
            phno,
            password: hashedPassword,
            role,
        })

        await newUser.save()
        res.redirect("/api/auth/login");
        // return res.render("signup", { message: "Signup successful, you can login now!" });
        // return res.status(201).send("signup successful")
    }catch(error){
        console.log("Error in Signup Controller: ",error)
        return res.status(500).send("Internal server Error")
    }
}

export const login = async (req,res) => {
    const {loginEmail, loginPassword} = req.body
    try{
        const user = await User.findOne({email: loginEmail})  // .select("-password")  //.select(["-password","-role","-phno"])
        if(!user) return res.status(400).render("signup", { isSignupActive: "",isLoginActive: "active", errorMessage: "Email does not exist" })

        const isMatch = await bcrypt.compare(loginPassword, user.password)
        if(!isMatch) return res.status(400).render("signup", { isSignupActive: "",isLoginActive: "active", errorMessage: "Invalid credentials" })

        generateToken(user._id, user.role, res)

        return res.redirect("/api/auth/home")
    }catch(error){
        console.log("Error in login Controller: ",error)
        return res.status(500).send("Internal server Error")
    }
}

export const logout = (req,res) => {
    try {
        res.clearCookie('uid', { path: '/' });
        res.redirect('/');
        // return res.status(200).send("logged out successfully")
    } catch (error) {
        console.log("Error in logout Controller: ",error)
        return res.status(500).send("Internal server Error")
    }
}