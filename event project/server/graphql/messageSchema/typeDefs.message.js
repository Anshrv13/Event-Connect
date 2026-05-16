export const typeDefs = `#graphql
    scalar DateTime

    type Message {
        id: ID!
        content: String!
        sender: ID!
        receiver: [ID!]!
        type: String!
        deleted: deletedStatus!
        media: String
        seen: [ID!]!
        createdAt: DateTime!
    }

    type deletedStatus {
        deleteForSender: Boolean!
        deleteForReceiver: Boolean!
        deleteForAll: Boolean!
    }
`