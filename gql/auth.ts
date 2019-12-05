import { gql } from "apollo-server";

const typeDefs = gql`

    type User {
        _id: ID
        authorized: Boolean
        guild: String
        name: String
        token: String
        role: ROLE
    }

    extend type Character {
        owner: User
    }

    enum ROLE {
        MEMBER
        OFFICER
    }

    input AuthInput {
        name: String!
        token: String!
        discordTag: String
    }

    extend type Query {
        users: [User]
        user(_id: ID): User
    }

    extend type Mutation {
        login(auth: AuthInput): User
    }
`;

const resolvers = {
    Query: {
        users: async (_, args, context) => {
            let result = await context.Auth.getAll();
            console.log(result);
            return result;
        },
        user: async (_, args, context) => {
            return context.Auth.getById(args._id);
        }
    },
    Mutation: {
        login: async (_, args, context) => {
            console.log('authorizing user', args);
            let authResult = await context.Auth.login(args.auth);
            console.log('authorized user: ', authResult);
            const mainCharacter = {
                owner: authResult._id,
                name: authResult.name,
                guild: authResult.organization
            }
            console.log('Upserting main: ', mainCharacter);
            let upsertCharacter = await context.Characters.upsertCharacter(mainCharacter);
            return authResult;
        },
    },
    User: {
        authorized: async (user, args, context) =>  {
            console.log('checking auth for', user);
            return context.Auth.isAuthorized(user);
        },
        guild: async (user, args, context) => {
            return context.Auth.getGuildByToken(user);
        }
    },
    Character: {
        owner: async (character, args, context) => {
            console.log(`getting ${character.name}'s owner: ${character.owner}`);
            return context.Auth.getById(character.owner);
        }
    }
};

export const schema = { typeDefs, resolvers };