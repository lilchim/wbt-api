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
    },
    Mutation: {
        login (_, args, context) {
            console.log('authorizing user', args);
            return context.Auth.login(args.auth);
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