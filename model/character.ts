import { v4 as uuidv4 } from 'uuid';

export interface Character {
    _id: string;
    owner: string;
    name: string;
    characterClass: string;
    guild: string;
}

const dbName = 'wbt-data';
const characterCollection = 'characters'

export const generateCharacterModel = ({ req, client }) => ({
    getById: async (id) => {
        console.log('getting character by id: ', id);
        let result = await client.db(dbName).collection(characterCollection).findOne({ _id: id });
        console.log(result);
        return result;
    },
    getAll: () => {
        return client.db(dbName).collection(characterCollection).find().toArray();
    },
    upsertCharacter: async (character) => {
        if (!character._id) {
            console.log(`Request to create new character ${character.name}`);
            character._id = uuidv4();
        }
        else {
            console.log(`Updating existing character named ${character.name}`);
        }

        let result = await client.db(dbName).collection(characterCollection)
            .findOneAndUpdate(
                { _id: character._id },
                { $set: { ...character } },
                { upsert: true }
            );
        console.log(result);
        return character;
    },
    getAllByOwner: ({_id}) => {
        return client.db(dbName).collection(characterCollection).find(
            {owner: _id}
        ).toArray();
    },
    upsertMultipleCharacters: (characters) => {

    },
    changeCharacterName: ({ id, name }) => {

    }
})