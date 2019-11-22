import { gql } from "apollo-server";

const typeDefs = gql`
    # Player Type Definition 
    type Player {
        id: ID
        name: String
        role: ROLE
        guild: String
        discordTag: String
        characterClass: CHARACTER_CLASS
        scouting: Boss
        scoutingSince: Float
    }

    input PlayerInput {
        name: String!
        token: String!
        characterClass: CHARACTER_CLASS!
        discordTag: String
    }

    enum CHARACTER_CLASS {
        MAGE
        WARRIOR
        PALADIN
        PRIEST
        ROGUE
        DRUID
        SHAMAN
        WARLOCK
    }

    enum ROLE {
        MEMBER
        OFFICER
    }

    type AuthResult {
        success: Boolean
        guild: String
    }

    extend type Boss {
        scouts: [Player]
    }

    extend type Query {
        players: [Player]
        player(name: String): Player
    }

    extend type Mutation {
        authorizeUser(token: String): AuthResult
        registerPlayer(player: PlayerInput): Player
        startScouting(name: String, bossName: String, startTime: Float): Boss
        stopScouting(name: String): Player
    }
`;

const resolvers = {
    Query: {
        players (_, args, context) {
            return context.Players.getAll();
        },
        player(_, args, context) {
            return context.Players.getById(args);
        }
    },
    Player: {
        scouting(player, args, context) {
            let currentlyScouting = context.Players.getById(player).scouting;
            if (currentlyScouting) {
                return context.Bosses.getBoss(currentlyScouting);
            }
            return currentlyScouting;
        },
        role(player, args, context) {
            return context.Players.getRole(player);
        }
    },
    Boss: {
        scouts(boss, args, context) {
            return context.Players.getScouts(boss);
        }
    },
    Mutation: {
        authorizeUser(_, args, context) {
            return context.Players.authorizeUser(args);
        },
        registerPlayer(_, args, context) {
            return context.Players.registerPlayer(args.player);
        },
        startScouting(_, args, context) {
            context.Players.startScouting(args);
            return context.Bosses.getBoss(args.bossName);
        },
        stopScouting(_, args, context) {
            return context.Players.stopScouting(args);
        }
    },
}

export const schema = { typeDefs, resolvers };