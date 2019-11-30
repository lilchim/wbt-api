import { v4 as uuidv4 } from 'uuid';

export interface SpawnLog {
    _id: any;
    bossId: any;
    spawnedAt: number;
    killedAt?: number;
}

export const generateSpawnLogModel = ({req, client}) => ({
    getById: async (id) => { 
        return client.db('wbt-data').collection('spawn-logs').findOne({_id: id});
    },
    getAll: async () => { 
        return client.db('wbt-data').collection('spawn-logs').find().toArray();
    },
    logSpawn: async ({bossId, spawnTime}) => { 
        // Log the boss spawn
        let log: SpawnLog = {
            _id: uuidv4(),
            bossId: bossId,
            spawnedAt: spawnTime ? spawnTime : Math.floor(Date.now() / 1000),
        }

        let logResult = await client.db('wbt-data').collection('spawn-logs').insertOne(log);
        return  log;

    },
    logKill: async ({_id, spawnId, timeOfDeath}) => { 
        // Update the kill log
        let logResult = await client.db('wbt-data').collection('spawn-logs').findOneAndUpdate(
            { _id: spawnId },
            { $set: { killedAt: timeOfDeath } },
            { upsert: true }
        )

        console.log(logResult);
        return logResult;
    },
})