export const Queries = `#graphql
    events: [Event!]!
    event (id: ID!): Event!
    userEvents (userID: ID!): [Event!]!
    userAppliedEvents (userID: ID!): [Event!]!

`