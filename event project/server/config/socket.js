import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import express from "express"
import { getChatHistory, markAsSeen, sendChat } from "../controllers/messageController.js";

dotenv.config();

const clientUrl = process.env.CLIENT_URL;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${clientUrl}`,
    credentials: true,
  },
});

const cnsp = io.of("/api/auth/message")
const userSocketMap = {}
const messagePending = {}

const getUserSocketID = (userID) => {
  return userSocketMap[userID]
}

cnsp.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  const email = socket.handshake.query.email
  const userID = socket.handshake.query.id

  if(userID) userSocketMap[userID] = socket.id

  socket.on("send-message", async ({content, receiverID, media}) => {
    const chat = await sendChat(content,receiverID,userID,media)
    const receiverSocketID = getUserSocketID(receiverID)

    if(!chat){
      return socket.emit('message-error', { message: `error! ${chat}`})
    }
    socket.emit('new-message', chat); // sender can also see his msg by this emit
    if(receiverSocketID ){
      cnsp.to(receiverSocketID).emit("new-message", chat)

      if(!messagePending[receiverID]){
        messagePending[receiverID] = [] // if receiver is not in messagePending object it will create its empty array object for them
      }
      messagePending[receiverID].push(chat)
      cnsp.to(receiverSocketID).emit("message-pending", chat)
    }
    
    return socket.emit('message-sent', { message: `Message Sent! ${chat}`})
  })

  socket.on("get-chat-history", async (friendID) => {
    const chats = await getChatHistory(friendID, userID)
    socket.emit("chat-history", chats)
  })

  socket.on("mark-as-seen", async ({userID, messageID}) => {
    const seen = await markAsSeen(userID, messageID)

    if (messagePending[userID]) {
      const updatedPendingMessages = messagePending[userID].filter(
        (message) => message._id !== messageID
      );
      messagePending[userID] = updatedPendingMessages;
    }

    socket.broadcast.emit("mark-seen", {userID, messageID})

    const pendingMessages = messagePending[userID]
    // console.log(pendingMessages)
    const userSocketID = getUserSocketID(userID)
    cnsp.to(userSocketID).emit("update-pending-count", {pendingMessages})

  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id} - ${email}`)
    delete userSocketMap[userID]
    delete messagePending[userID]
  })

});

export { server, io, app, cnsp, getUserSocketID };
