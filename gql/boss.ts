import { gql } from 'apollo-server';
import { addHours, UTCTimestampSeconds } from '../util';
import { WINDOW_DURATIONS_SECONDS } from '../settings';

const typeDefs = gql`
    # Boss Type Definition
    type Boss {
        id: ID
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
        boss(name: String): Boss
        bosses: [Boss]
    }

    extend type Mutation {
        reportKill(name: String, killedOn: Float): Boss
    }
`;

const resolvers = {
    Query: {
        boss(_: any, args: any, context: any) {
            return context.Bosses.getBoss(args.name);
        },
        bosses(_, args, context) {
            return context.Bosses.getBosses();
        }
    },
    Boss: {
        window(boss: any, args: any, context: any) {
            let b = context.Bosses.getBoss(boss.name);
            let serverResetUTC = context.Server.lastReset();
            if(serverResetUTC > b.lastKilled) {
                return useServerResetWindow(b, serverResetUTC);
            }
            let lastKill = new Date(b.lastKilled * 1000);
            console.log('last killed: ', lastKill);

            // let windowOpen = addHours(lastKill, 24)
            // let windowCloses = addHours(windowOpen, 72);

            let windowOpen = b.lastKilled + WINDOW_DURATIONS_SECONDS.windowOpen;
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
            context.Bosses.reportKill(args);
            return context.Bosses.getBoss(args.name);
        }
    }
}

export const schema = { typeDefs, resolvers }

const useServerResetWindow = (boss, serverResetTimestamp) => {
    console.log('Server Restart detected. Adjusting spawn window');
    let resetDate = new Date(serverResetTimestamp * 1000);
    // let windowOpen = addHours(resetDate, 15);
    // let windowCloses = addHours(resetDate, 30);

    let windowOpen = serverResetTimestamp + WINDOW_DURATIONS_SECONDS.serverResetOpen;
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