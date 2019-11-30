import { v4 as uuidv4 } from 'uuid';

export enum Roles {
    OFFICER = 'OFFICER',
    MEMBER = 'MEMBER'
}

export interface User {
    _id: string;
    token: string;
    name: string;
    role: string;
    organization: string;
    discordTag?: string;
    lastLogin: number;
}

export const generateAuthModel = ({ req, client, officers, authKeys, registeredUsers }) => ({
    login: async ({ name, token, discordTag }) => { //check
        console.log(`authorizing ${name} with token ${token}`)
        let auth = authKeys.get(token);
        console.log(auth);

        const existingUser = await client.db('wbt-data').collection('users').findOne({ name: name, token: token });
        console.log(existingUser);
        if (existingUser) return existingUser;

        console.log(`${name} is a new user registering with token ${token}`);

        if (auth && auth.role === Roles.OFFICER) {
            console.log('Officer role requires whitelist');
            if (officers.indexOf(name) < 0) {
                throw new Error('User is not authorized for this role');
            }
        }

        // Create a new User
        let user: User = {
            _id: uuidv4(),
            token: token,
            name: name,
            role: auth.role,
            discordTag: discordTag ? discordTag : '',
            organization: auth.guild,
            lastLogin: Date.now()
        }

        const result = await client.db('wbt-data').collection('users').insertOne(
            user,
        );

        return user;

    },
    getById: async (id) => {
        const result = await client.db('wbt-data').collection('users').findOne({_id: id});
        return result;
    },
    getAll: async () => {
        const result = await client.db('wbt-data').collection('users').find().toArray()
        return result;
    },
    getRole: ({ token }) => { return authKeys.get(token).role },
    getGuildByToken: ({ token }) => { return authKeys.get(token).guild},
    isAuthorized: async ({ name, token }) => { //check
        console.log(`verifying authorization for ${name} with token ${token}`)
        let existingUser = await client.db('wbt-data').collection('users').findOne({ name: name, token: token });
        return existingUser ? true : false;
    },
})