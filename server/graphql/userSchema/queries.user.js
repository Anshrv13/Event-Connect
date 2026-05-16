export const queries = `#graphql
    users: [User!]!
    user (id: ID!): User!
    userSearch (query: String!, curUser: ID!): UserSearchResponse!
`