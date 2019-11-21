import { ApolloServer, gql } from "apollo-server";
import { schema as bossSchema } from './gql/boss'
import { schema as playerSchema } from './gql/player';
import { schema as serverSchema } from './gql/server';
import { generateBossModel } from "./model/boss";
import { generatePlayerModel } from './model/player';
import { generateServerModel } from "./model/server";

const typeDefs = [
    gql` 
    type Query { 
        root: String
    }
    type Mutation {
        root: String
    }
    `,
    bossSchema.typeDefs,
    playerSchema.typeDefs,
    serverSchema.typeDefs
]

const resolvers = [
    bossSchema.resolvers,
    playerSchema.resolvers,
    serverSchema.resolvers
]

const server = new ApolloServer( {
    typeDefs,
    resolvers,
    context: ({req}) => {
        return {
            Server: generateServerModel({req}),
            Bosses: generateBossModel({req}),
            Players: generatePlayerModel({req})
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀 WBT Server running on ${url}`);
  });