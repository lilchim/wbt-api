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
    getByNameAndOwner: async ({ name, owner }) => {
        let result = await client.db(dbName).collection(characterCollection).findOne(
            {
                owner: owner,
                name: name
            }
        );
        console.log('character.getByNameAndOwner found: ', result);
        return result;
    },
    getAll: () => {
        return client.db(dbName).collection(characterCollection).find().toArray();
    },
    upsertCharacter: async (character) => {
        console.log('character.upsertCharacter upserting', character);

        let result = await client.db(dbName).collection(characterCollection)
            .findOneAndUpdate(
                { owner: character.owner, name: character.name},
                { $set: { ...character } },
                { upsert: true, returnOriginal: false }
            );
        console.log(`upserted character: `, result.value);
        return result.value;
    },
    getAllByOwner: ({ _id }) => {
        return client.db(dbName).collection(characterCollection).find(
            { owner: _id }
        ).toArray();
    },
    upsertMultipleCharacters: (characters) => {

    },
    changeCharacterName: ({ id, name }) => {

    }
})