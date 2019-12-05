import { gql } from 'apollo-server';
import { addHours, UTCTimestampSeconds } from '../util';
import { WINDOW_DURATIONS_SECONDS } from '../settings';

const typeDefs = gql`
    # Boss Type Definition
    type Boss {
        _id: ID
        activeInstance: ID
        name: String
        window: SpawnWindow
        lastKilled: Float
        alive: Boolean
    }

    type SpawnWindow {
        open: Boolean
        fromRestart: Boolean
        opensOn: Float
        openUntil: Float
    }

    extend type Query {
        boss(_id: ID): Boss
        bosses: [Boss]
    }

    extend type Mutation {
        reportKill(bossId: ID!, spawnId: ID!, timeOfDeath: Float): Boss
        spawnBoss(bossId: ID!, spawnId: ID!, spawnTime: Float): Boss
    }
`;

const resolvers = {
    Query: {
        boss(_: any, args: any, context: any) {
            return context.Bosses.getById(args._id);
        },
        bosses(_, args, context) {
            return context.Bosses.getAll();
        }
    },
    Boss: {
        alive: (boss) => {
            if(boss.alive === undefined) return false;
            return boss.alive;
        },
        lastKilled: (boss) => {
            if(!boss.lastKilled) return 0;
            return boss.lastKilled;
        },
        activeInstance: async (boss, args, context) => {
            if(!boss.activeInstance) return -1;
            return boss.activeInstance;
        },
        window: async (boss: any, args: any, context: any) => {
            let b = await context.Bosses.getById(boss._id);
            console.log('computing window for boss ', b);
            let serverResetUTC = context.Server.lastReset();
            if(serverResetUTC > b.lastKilled) {
                return useServerResetWindow(b, serverResetUTC);
            }
            let lastKill = new Date(b.lastKilled * 1000);
            console.log('last killed: ', lastKill);

            let windowOpen = b.lastKilled + WINDOW_DURATIONS_SECONDS.openAfterKill;
            let windowCloses = b.lastKilled + WINDOW_DURATIONS_SECONDS.windowDuration;

            console.log('window opens: ', windowOpen);
            console.log('window closes: ', windowCloses);
            return {
                open: UTCTimestampSeconds() > windowOpen,
                opensOn: windowOpen,
                openUntil: windowCloses,
                fromRestart: false
            }
        }
    },
    Mutation: {
        reportKill(_: any, args: any, context: any) {
            console.log(`reporting kill`, args);
            let killedBoss = context.Bosses.killBoss(args);
            console.log('reportKill returning ', JSON.stringify(killedBoss));
            let log = context.SpawnLog.logKill(args);
            return killedBoss;
        },
        spawnBoss: async (_, args, context) => {
            console.log(`spawning boss with id ${args.bossId}`)
            let spawnedBoss = await context.Bosses.spawnBoss(args);
            let log = context.SpawnLog.logSpawn(args);
            return spawnedBoss;
        }
    }
}

export const schema = { typeDefs, resolvers }

const useServerResetWindow = (boss, serverResetTimestamp) => {
    console.log('Server Restart detected. Adjusting spawn window');
    let resetDate = new Date(serverResetTimestamp * 1000);
    // let windowOpen = addHours(resetDate, 15);
    // let windowCloses = addHours(resetDate, 30);

    let windowOpen = serverResetTimestamp + WINDOW_DURATIONS_SECONDS.openAfterReset;
    let windowCloses = serverResetTimestamp + WINDOW_DURATIONS_SECONDS.serverResetDuration;

    console.log('window opens:', windowOpen);
    console.log('window closes:', windowCloses);
    return {
        open: UTCTimestampSeconds() > windowOpen,
        opensOn: windowOpen,
        openUntil: windowCloses,
        fromRestart: true
    }
}