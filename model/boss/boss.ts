
import { v4 as uuidv4 } from 'uuid';

export interface SpawnLog {
    _id: any;
    bossId: any;
    spawnedAt: number;
    killedAt?: number;
}


export interface Boss {
    _id: any;
    name: string;
    // Timestamp stored in Seconds (Unix Epoch time, or UTC Seconds)
    alive: boolean;
    lastKilled: number;
}

export const generateBossModel = ({req, client}) => ({
    getById: async (id) => { //check
        return client.db('wbt-data').collection('bosses').findOne({_id: id});
    },
    getAll: async () => { //check
        return client.db('wbt-data').collection('bosses').find().toArray();
    },
    spawnBoss: async ({bossId, spawnTime}) => { // check
        // Mark the boss as alive
        let updateBoss = await client.db('wbt-data').collection('bosses').findOneAndUpdate(
            { _id: bossId },
            { $set: { alive: true } },
            { upsert: true }
        )
        console.log('spawned boss: ', updateBoss.value);

        return updateBoss.value;
    },
    killBoss: async ({_id, spawnId, timeOfDeath}) => { //check
        let killBoss = await client.db('wbt-data').collection('bosses').findOneAndUpdate(
            { _id: _id },
            { $set: { alive: false, lastKilled: timeOfDeath  }},
            { upsert: true }
        )
        console.log(`Killed boss: ${JSON.stringify(killBoss.value)}`);

        return killBoss.value;
    },
    upsert: async (boss) => { //check
        console.log('updating boss', boss);
        let result = await client.db('wbt-data').collection('bosses').findOneAndUpdate(
            { _id: boss._id },
            { $set: boss },
            { upsert: true }
        )
        console.log(result.value);
        return result.value;
    }
})