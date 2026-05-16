import { getChatHistory, getSearchMessages } from "../../controllers/messageController.js"

const req = {}
const res = {
    status: (statusCode) => {
        return {
            json:(data) => {
                return { statusCode, data }
            }
        }
    }
}

const Query = {
    getUserMessages: async (_, {friendID, userID}) => {
        const messages = await getChatHistory(friendID, userID)
        if(messages.message) throw new Error(messages.message)
        return messages
    },
    getUserSearchMessages: async (_, {userID, search}) => {

        if(!search.trim() || userID === null ) throw new Error("Search can be empty")
        const message = await getSearchMessages(userID, search)
        if(message.message) throw new Error(message.message)
        return message
    }
    // message (id: ID!): Message!,
}

const Mutation = {}

export const resolvers = { Query, Mutation }