import express from "express"
import connectToMongo from "./config/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoutes.js"
import morgan from 'morgan'
import { logFile } from "./middlewares/logFileMiddleware.js";
import path from "path"

dotenv.config();

const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join("E:/event project/", 'views'))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('combined'));  // for viewing logs in console
app.use(logFile);

app.use("/api/auth", authRoute)

app.get("/",(req,res) => {
    res.render("index")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
    connectToMongo(process.env.MONGO_URI)
})