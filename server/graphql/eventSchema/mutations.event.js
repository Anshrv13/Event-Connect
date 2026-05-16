export const Mutations = `#graphql
    createEvent(
        title: String!,
        description: String!
        type: String!
        location: String!
        host: ID!
        totalDays: Int!
        workHours: Int!
        payRate: Int!
        startDate: Date!
        endDate: Date!
        roles: [RolesInput!]!
        image: String
    ): Event

    editEvent(
        title: String!,
        eventID: ID!,
        description: String!
        type: String!
        location: String!
        totalDays: Int!
        workHours: Int!
        payRate: Int!
        startDate: Date!
        endDate: Date!
        roles: [RolesInput!]!
        # image: String
    ): Event

    deleteEvent(eventID: ID!): Event

    updateApplicationStatus(eventID: ID!, role: String!, applicantID: ID!, status: String!): Event
    applyEvent(eventID: ID!, role: String!, applicantID: ID!): Event
`