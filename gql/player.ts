import { gql } from "apollo-server";

const typeDefs = gql`
    # Player Type Definition 
    type Player {
        name: String
        role: ROLE
        guild: String
        discordTag: String
        class: PLAYERCLASS
        scouting: Boss
        scoutingSince: Float
    }

    input PlayerInput {
        name: String!
        guild: String!
        class: PLAYERCLASS!
        discordTag: String
    }

    enum PLAYERCLASS {
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
        CLIQUE
        FODDER
    }

    extend type Boss {
        scouts: [Player]
    }

    extend type Query {
        players: [Player]
        player(name: String): Player
    }

    extend type Mutation {
        authorizeUser(token: String): Player
        registerPlayer(player: PlayerInput): Player
        startScouting(name: String, bossName: String, startTime: Float): Boss
        stopScouting(name: String): Player
    }
`;

const resolvers = {
    Query: {
        players (_, args, context) {
            return context.Players.getPlayers();
        },
        player(_, args, context) {
            return context.Players.getPlayer(args);
        }
    },
    Player: {
        scouting(player, args, context) {
            let currentlyScouting = context.Players.getPlayer(player).scouting;
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