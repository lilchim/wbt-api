
import { v4 as uuidv4 } from 'uuid';


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
        let spawnedBoss = await client.db('wbt-data').collection('bosses').findOneAndUpdate(
            { _id: bossId },
            { $set: { alive: true } },
            { upsert: true }
        )
        console.log('spawned boss: ', spawnedBoss.value);

        return spawnedBoss.value;
    },
    killBoss: async ({bossId, timeOfDeath}) => { //check
        let killedBoss = await client.db('wbt-data').collection('bosses').findOneAndUpdate(
            { _id: bossId },
            { $set: { alive: false, lastKilled: timeOfDeath, activeInstance: uuidv4()  }},
            { upsert: true }
        )
        console.log(`Killed boss: ${JSON.stringify(killedBoss.value)}`);

        return killedBoss.value;
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