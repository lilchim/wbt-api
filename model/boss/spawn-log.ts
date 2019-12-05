import { v4 as uuidv4 } from 'uuid';

export interface SpawnLog {
    _id: any;
    instanceId: any;
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
    getActiveLog: async (bossId) => {
        console.log('finding current log for boss with id ', bossId);
        let activeLog = await client.db('wbt-data').collection('scouting-logs')
            .find(
                {
                    target: bossId,
                }
            )
            .sort(
                { spawnedAt: 1 }
            ).toArray()

        console.log('current spawn instance: ', activeLog);
    },
    logSpawn: async ({bossId, spawnTime, instanceId}) => { 
        // Log the boss spawn
        let log: SpawnLog = {
            _id: uuidv4(),
            instanceId: instanceId ? instanceId : -1,
            bossId: bossId,
            spawnedAt: spawnTime ? spawnTime : Math.floor(Date.now() / 1000),
        }

        let logResult = await client.db('wbt-data').collection('spawn-logs').insertOne(log);
        return  log;

    },
    logKill: async ({bossId, instanceId, timeOfDeath}) => { 
        // Update the kill log
        let logResult = await client.db('wbt-data').collection('spawn-logs').findOneAndUpdate(
            { 
                target: bossId,
                instanceId: instanceId ? instanceId : -1
            },
            { $set: { killedAt: timeOfDeath } },
            { upsert: true }
        )

        console.log(logResult);
        return logResult;
    },
})