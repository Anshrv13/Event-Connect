export const Queries = `#graphql
    getUserMessages(friendID: ID!, userID: ID!): [Message!]!
    getUserSearchMessages(userID: ID!, search: String!): [Message!]!
    message(id: ID!): Message!
`