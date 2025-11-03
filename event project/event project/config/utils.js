import jwt from "jsonwebtoken"

export const generateToken = async (userID, role, res) => {
    const token = jwt.sign({userID, role},process.env.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("uid",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })

    // res.setHeader("Authorization", `Bearer ${token}`); // you can set any of either or both of them as well cookie and header in my case i am setting them both
    return token
}