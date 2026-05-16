import { cnsp, getUserSocketID } from "../config/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const sendChat = async (content, receiverID, userID, media) => {  // used in socket.js
    try {
        const senderID = userID
        const type = "direct"
        let newMessage;
  
        if (media && media.size > 0) {
            if (!media.type || !media.size || !media.originalName || !media.newName) {
                return { message: "Media type, size, originalName, and newName are required" };
            }
            if (media.type !== 'file' && !media.url) {
                return { message: 'URL is required for image or video types'};
            }
            
            const newMedia = {
                type: "image",
                size: media.size,
                originalName: media.originalName,
                newName:`${Date.now()}-${media.originalName}`
            }
  
            newMessage = new Message({
                content,
                sender: senderID,
                receiver: receiverID,
                type,
                media: newMedia
            });
        }else{
          newMessage = new Message({
            content,
            sender: senderID,
            receiver: receiverID,
            type
          });
        }

        await newMessage.save();
        return newMessage
           
      }catch (error) {
        console.log("Error in chatMessage Controller: ", error);
        return { message: "Internal server error." }
      }
};
export const markAsSeen = async (userID, messageID) => {
  try {
    if (!userID || !messageID ) {
      throw new Error('Invalid parameters');
    }
    const message = await Message.findById(messageID)
    
    if (!message) {
      return { message: "Message not found" };
    }
    
    if(message.seen.includes(userID)){
      return { message: "user has already seen it" }
    }

    message.seen.push(userID)
    await message.save()

    return {message: "Message marked as seen successfully"}
  } catch (error) {
    console.log("Error in markAsSeen Controller: ", error);
    return { message: "Internal server Error" };
  }
}

export const searchQuery = async (req, res) => {
    try {
        const {query, curUser} = req.body
        
        if (!query.trim()) return res.status(400).json({ message: "Query cannot be empty" });
        const user = await User.findOne({ email:query }).select("email name friends _id")
        if (!user) return res.status(400).json({ message: "User Not Found" })

        const isFriend = Array.isArray(user.friends) && user.friends.includes(curUser);
        return res.status(200).json({user, isFriend});
    } catch (error) {
        console.log("Error in searchQuery Controller: ", error);
        return res.status(500).json({ message:"Internal server Error"});
    }
}

export const getFriends = async (req,res) => {
    try {
        const { curUser } = req.body
        const getFriends = await User.findById(curUser).populate("friends","name email role isActive").select("friends -_id")
        if(!getFriends) return res.status(400).json({ message: "No friends found" })

        return res.status(200).json({ getFriends: getFriends.friends })
    } catch (error) {
        console.log("Error in getFriends Controller: ", error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

export const getChatHistory = async (friendID, userID) => { // used in socker.js
  try {
    const senderID = userID;
    const receiverID = friendID;

    const messages = await Message.find({
      $or: [
        { sender: senderID, receiver: receiverID },
        { sender: receiverID, receiver: senderID },
      ],
    })
      .sort({ createdAt: 1 })
      .select("-updatedAt");

    if (!messages || messages.length === 0) return { message: "No messages found" };

    return messages;
  } catch (error) {
    console.log("Error in getChat Controller: ", error);
    return { message: "Internal server Error" };
  }
};

export const addFriend = async (req,res) => {
    try {
        const {friendID} = req.body
        const curUser = req.user._id.toString()

        if (friendID === curUser) return res.status(400).json({ message: "Cannot add yourself as a friend" });
        const user = await User.findById(curUser)
        const friend = await User.findById(friendID)

        if (!user || !friend) return res.status(404).json({ message: "No user found" });
        if (user.friends.includes(friendID)) return res.status(400).json({ message: "Already friends" });

        user.friends.push(friendID)
        friend.friends.push(curUser)

        await user.save()
        await friend.save()
        const curUserSocketID = getUserSocketID(user._id)
        const receiverSocketID = getUserSocketID(friend._id)

        if(curUserSocketID){
            cnsp.to(curUserSocketID).emit("newFriend", {
                _id: friend.id,
                name: friend.name,
                email: friend.email,
                role: friend.role,
                isActive: friend.isActive
            });
        }
        if(receiverSocketID){
            cnsp.to(receiverSocketID).emit("newFriend", {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            });
        }

        return res.status(200).json({ message: "Friend added successfully" });
    } catch (error) {
        console.log("Error in addFriend Controller: ", error);
        return res.status(500).json({ message: "Internal server Error"});
    }
}

export const getSearchMessages = async (userID, search) => {
  try {
    if (!search.trim() || userID === null) return { message: "Search cannot be empty" };
    const messages = await Message.find({ $or: [
      {sender: userID, content: { $regex: search, $options: "i"}},
      {receiver: userID, content: { $regex: search, $options: "i"}}
    ]}).select("-updatedAt");

    if (!messages || messages.length === 0) return { message: "No messages found" };

    return messages;
  } catch (error) {
    console.log("Error in getSearchMessages Controller: ", error);
    return { message: "Internal server Error" };
  }
};