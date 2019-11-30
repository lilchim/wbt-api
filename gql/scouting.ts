import { gql } from "apollo-server";

const typeDefs = gql`
    # Player Type Definition 
    extend type Character {
        scouting: CharacterScouting
    }

    type CharacterScouting {
        _id: ID
        target: Boss
        startTime: Float
        stopTime: Float
    }

    extend type Boss {
        scouts: [Character]
    }

    input StartScoutingInput {
        scoutId: ID!
        targetId: ID!
        startTime: Float
        stopTime: Float
    }

    input StopScoutingInput {
        sessionId: ID
        stopTime: Float
    }

    extend type Mutation {
        startScouting(input: StartScoutingInput!): CharacterScouting
        stopScouting(input: StopScoutingInput!): CharacterScouting
    }
`;

const resolvers = {
    Query: {

    },
    Mutation: {
        startScouting: async (_, args, context) => {
            let result = await context.Scouting.startScouting(args.input);
            return result;
        },
        stopScouting: async (_, args, context) => {
            let result = await context.Scouting.stopScouting(args);
            return result;
        }
    },
    Boss: {
        scouts: async (boss, args, context) => {
            console.log(`gql getting scouts for ${boss}`)
            let activeScouts = await context.Scouting.getActiveScoutsForTarget(boss)
            console.log('found scouts', activeScouts);
            return activeScouts.map(scoutId => {
                return context.Characters.getById(scoutId);
            })
        }
    },
    Character: {
        scouting: async (character, args, context) => {
            console.log(`Getting scouting status for character ${character.name}`)
            const currentSession = await context.Scouting.getCurrentSessionForScout(character);
            console.log('found session:', currentSession);
            return currentSession;
        },
    },
    CharacterScouting: {
        target: async (scoutingSession, args, context) => {
            return context.Bosses.getById(scoutingSession.targetId);
        }
    }
}

export const schema = { typeDefs, resolvers };