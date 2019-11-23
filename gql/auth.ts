import { gql } from "apollo-server";

const typeDefs = gql`
    extend type Player {
        authorized: Boolean
        token: String
        role: ROLE
    }

    enum ROLE {
        MEMBER
        OFFICER
    }

    input AuthInput {
        name: String
        token: String
    }

    extend type Query {
        registeredUsers: [Player]
    }

    extend type Mutation {
        registerUser(auth: AuthInput): Player
    }
`;

const resolvers = {
    Query: {
        registeredUsers (_, args, context) {
            return context.Auth.getRegisteredUsers();
        }
    },
    Mutation: {
        registerUser (_, args, context) {
            console.log('registering user', args);
            let newPlayer = context.Auth.registerUser(args.auth);
            console.log('new player!', newPlayer);
            context.Players.updatePlayerInfo(newPlayer);
            return newPlayer;
        }
    },
    Player: {
        authorized (player, args, context) {
            console.log('checking auth for', player);
            return context.Auth.isAuthorized(player);
        },
        role (player, args, context) {
            console.log(player);
            return context.Auth.getRole(player);
        }
    }
};

export const schema = { typeDefs, resolvers };