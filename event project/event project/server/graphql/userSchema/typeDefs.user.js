export const typeDefs = `#graphql
    type User{
        id: ID!
        name: String!
        email: String!
        phno: Int!
        password: String
        role: String!
        isActive: Boolean!
        CV: String
        rating: Int
        location: String
        friends: [User]
        friendRequests: [ID]
    }

    type UserSearchResponse {
        user: User!
        isFriend: Boolean!
    }

`