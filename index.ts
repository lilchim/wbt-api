import { ApolloServer, gql } from "apollo-server";
import { schema as bossSchema } from './gql/boss'
import { schema as serverSchema } from './gql/server';
import { schema as authSchema } from './gql/auth';
import { schema as characterSchema } from './gql/character';
import { schema as scoutingSchema } from './gql/scouting';
import { generateBossModel } from "./model/boss/boss";
import { generateServerModel } from "./model/server";
import { generateAuthModel } from "./model/auth";
import { generateCharacterModel } from "./model/character";
import { generateScoutingModel } from './model/scouting';

import { BossConfiguration } from './model/boss/config';


require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');


let officers;
if (process.env.OFFICERS) {
    officers = process.env.OFFICERS.split(',');
}
console.log(officers);

const authKeys = new Map<string, any>();
if (process.env.AUTH_KEYS) {
    console.log(`Configured Authentication Tokens: `, process.env.AUTH_KEYS);
    process.env.AUTH_KEYS.split(',').forEach(key => {
        console.log('Checking auth key: ', key);
        let token = process.env[key];
        if (token) {
            const auth = jwt.verify(token, JWT_SECRET);
            console.log('Verified auth: ', auth);
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
    serverSchema.typeDefs,
    authSchema.typeDefs,
    characterSchema.typeDefs,
    scoutingSchema.typeDefs
]

const resolvers = [
    bossSchema.resolvers,
    serverSchema.resolvers,
    authSchema.resolvers,
    characterSchema.resolvers,
    scoutingSchema.resolvers
]

const registeredUsers = new Map<string, any>();

import { MongoClient } from 'mongodb';
import { connectClient, listDatabases } from './data-sources/mongodb/client';
import { generateSpawnLogModel } from "./model/boss/spawn-log";
let client: MongoClient 

async function createMongoClient() {
    const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
    const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    client = await connectClient(mongoConnectionString, mongoClientOptions);
    listDatabases(client);

    // Load boss configuration
    console.log('configuring bosses');
    console.log(BossConfiguration.bosses);
    BossConfiguration.bosses.forEach(boss => {
        console.log(boss);
        generateBossModel({req: undefined, client}).upsert(boss);
    })
}

createMongoClient();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {
            Auth: generateAuthModel({ req, client, officers, authKeys, registeredUsers }),
            Characters: generateCharacterModel({req, client}),
            Server: generateServerModel({ req }),
            Bosses: generateBossModel({ req, client }),
            Scouting: generateScoutingModel({ req, client }),
            SpawnLog: generateSpawnLogModel({ req, client })
        }
    }
})

server.listen({
    port: process.env.PORT || 4000
}).then(({ url }) => {
    console.log(`🚀 WBT Server running on ${url}`);
});