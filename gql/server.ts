import { gql } from "apollo-server";

const typeDefs = gql`
    extend type Mutation {
        logServerReset(time: Float): Float 
    }
`;

const resolvers = {
    Query: {

    },
    Mutation: {
        logServerReset(_, args, context) {
            context.Server.logServerReset(args.time);
            return context.Server.lastReset();
        }
    }
}

export const schema = { typeDefs, resolvers };