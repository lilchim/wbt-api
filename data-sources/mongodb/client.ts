
import { MongoClient } from 'mongodb';

export async function connectClient(connectionString, options) {
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(connectionString, options);

    try {
        await client.connect();
        return client;
    }
    catch (err) {
        console.error(err, err.stack);
    }
}

export async function listDatabases(client) {
    const databases = await client.db().admin().listDatabases();
    console.log('Databases: ');
    console.log(databases);
    if(databases.databases) {
        databases.databases.forEach(db => {
            console.log(`-- ${db.name}`);
        });
    }
}
