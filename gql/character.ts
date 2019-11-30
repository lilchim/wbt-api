import { gql } from "apollo-server";

const typeDefs = gql`
    # Character Type Definition 
    type Character {
        _id: ID
        name: String
        guild: String
        characterClass: CHARACTER_CLASS
    }

    extend type User {
        characters: [Character]
    }

    input CharacterInput {
        _id: ID
        owner: String!
        name: String!
        guild: String
        characterClass: CHARACTER_CLASS
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
        HUNTER
    }

    extend type Query {
        characters: [Character]
        character(_id: ID): Character
    }

    extend type Mutation {
        upsertCharacter(character: CharacterInput): Character
    }
`;

const resolvers = {
    Query: {
        character(_, args, context) {
            return context.Characters.getById(args._id);
        },
        characters(_, args, context) {
            return context.Characters.getAll();
        }

    },
    Character: {
    },
    Mutation: {
        upsertCharacter(_, args, context) {
            return context.Characters.upsertCharacter(args.character);
        },
    },
    User: {
        characters: async (user, args, context) => {
            console.log(`retrieving characters for user ${user._id}`)
            return context.Characters.getAllByOwner(user);
        }
    }
}

export const schema = { typeDefs, resolvers };