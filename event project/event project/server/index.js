import express from "express"
import connectToMongo from "./config/db.js"
import dotenv from "dotenv"
import authRoute from "./routes/authRoutes.js"
import messageRoute from "./routes/messageRoute.js"
import adminRoute from "./routes/adminRoute.js"
import contactUsRoute from "./routes/contactUsRoute.js"
import eventManagerRoute from "./routes/eventManagerRoute.js"
import userRoute from "./routes/userRoute.js"
import { logFile } from "./middlewares/logFileMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from 'morgan'
import { server, app } from "./config/socket.js"
import { expressMiddleware } from "@apollo/server/express4"
import createApolloServer from "./graphql/index.js"
import { protectRoute } from "./middlewares/authMiddleware.js"

dotenv.config();
// const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('combined'));  // for viewing logs in console "dev", "combined"
app.use(logFile);

app.use('/graphql', protectRoute, expressMiddleware( await createApolloServer() ))
app.use("/api", contactUsRoute)
app.use("/api/auth", authRoute)
app.use("/api/auth/message", messageRoute)
app.use("/api/auth/admin", adminRoute)
app.use("/api/auth/eventManager", eventManagerRoute)
app.use("/api/auth/user", userRoute)

const PORT = Number(process.env.PORT) || 5000

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
    connectToMongo(process.env.MONGO_URI)
})