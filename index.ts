import { ApolloServer, gql } from "apollo-server";
import { schema as bossSchema } from './gql/boss'
import { schema as playerSchema } from './gql/player';
import { schema as serverSchema } from './gql/server';
import { schema as authSchema } from './gql/auth';
import { generateBossModel } from "./model/boss";
import { generatePlayerModel } from './model/player';
import { generateServerModel } from "./model/server";
import { generateAuthModel } from "./model/auth";

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');


let officers;
if(process.env.OFFICERS) {
    officers = process.env.OFFICERS.split(',');
}
console.log(officers);

const authKeys = new Map<string, any>();
if(process.env.AUTH_KEYS) {
    console.log(process.env.AUTH_KEYS);
    process.env.AUTH_KEYS.split(',').forEach(key => {
        console.log('Checking auth key: ', key);
        let token = process.env[key];
        if(token) {
            const auth = jwt.verify(token, JWT_SECRET);
            console.log('Verified auth: ',auth);
            authKeys.set(token, auth);
        }
    })
}



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
    serverSchema.typeDefs,
    authSchema.typeDefs
]

const resolvers = [
    bossSchema.resolvers,
    playerSchema.resolvers,
    serverSchema.resolvers,
    authSchema.resolvers
]

const registeredUsers = new Map<string, any>();

const server = new ApolloServer( {
    typeDefs,
    resolvers,
    context: ({req}) => {
        return {
            Auth: generateAuthModel({req, officers, authKeys, registeredUsers}),
            Server: generateServerModel({req}),
            Bosses: generateBossModel({req}),
            Players: generatePlayerModel({req})
        }
    }
})

server.listen({
    port: process.env.PORT || 4000
}).then(({ url }) => {
    console.log(`🚀 WBT Server running on ${url}`);
  });