import { ApolloServer } from "@apollo/server"
import { UserSchema } from "./userSchema/index.js"
import { EventSchema } from "./eventSchema/index.js"
import { MessageSchema } from "./messageSchema/index.js"

const context = ({ req }) => {
    const user = req.user
    return { user }
}

const createApolloServer = async () => {
    const gqlServer = new ApolloServer({
        typeDefs: `#graphql

        ${UserSchema.typeDefs}
        ${EventSchema.typeDefs}
        ${MessageSchema.typeDefs}
        
        type Query{
            ${UserSchema.queries}
            ${EventSchema.Queries}
            ${MessageSchema.Queries}
        }
        type Mutation{
            ${UserSchema.mutations}
            ${EventSchema.Mutations}
            ${MessageSchema.Mutations}
        }
        `,
        resolvers: {
            Query: {
                ...UserSchema.resolvers.query,
                ...EventSchema.resolvers.Query,
                ...MessageSchema.resolvers.Query
            },
            Mutation: {
                ...UserSchema.resolvers.mutation,
                ...EventSchema.resolvers.Mutation,
                ...MessageSchema.resolvers.Mutation
            }
        },
        persistedQueries: true,
        context,
        introspection: process.env.NODE_ENV === 'development',
        playground: process.env.NODE_ENV === 'development',
    })
    await gqlServer.start()
    return gqlServer
}

export default createApolloServer;
