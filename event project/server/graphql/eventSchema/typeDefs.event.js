export const typeDefs = `#graphql
    scalar Date
    scalar DateTime
    scalar JSON

    type Event {
        id: ID!,
        title: String!,
        description: String!
        type: String!
        location: String!
        host: User!
        totalDays: Int!
        workHours: Int!
        payRate: Int!
        startDate: Date!
        endDate: Date!
        roles: [Roles!]!
        image: String
        createdAt: DateTime
    }

    type Roles {
        role: String!
        selected: JSON
        applicants: [Applicants]
    }

    type Applicants {
        status: String,
        appliedAt: DateTime,
        applicant: JSON
    }

    input RolesInput {
        role: String!
        selected: String
        applicants: JSON
    }

`
