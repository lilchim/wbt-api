import { gql } from 'apollo-server';
import { addHours } from '../util';

const typeDefs = gql`
    # Boss Type Definition
    type Boss {
        name: String
        window: SpawnWindow
        lastKilled: Float
    }

    type SpawnWindow {
        open: Boolean
        opensOn: Float
        openUntil: Float
    }

    extend type Query {
        boss(name: ID): Boss
    }

    extend type Mutation {
        reportKill(name: ID, killedOn: Float): Boss
    }
`;

const resolvers = {
    Query: {
        boss(_: any, args: any, context: any) {
            console.log('get boss', args.name)
            return context.Bosses.getBoss(args.name);
        }
    },
    Boss: {
        lastKilled(parent) {
            return new Date(parent.lastKilled * 1000).getTime();
        },
        window(boss: any, args: any, context: any) {
            let b = context.Bosses.getBoss(boss.name);
            let serverResetUTC = context.Server.lastReset();
            if(serverResetUTC > b.lastKilled) {
                return useServerResetWindow(b, serverResetUTC);
            }
            let lastKill = new Date(b.lastKilled * 1000);
            console.log('last killed: ', lastKill);

            let windowOpen = addHours(lastKill, 24)
            let windowCloses = addHours(windowOpen, 72);

            console.log('window opens: ', windowOpen);
            console.log('window closes: ', windowCloses);
            return {
                open: Date.now() > windowOpen.getTime(),
                opensOn: windowOpen.getTime(),
                openUntil: windowCloses.getTime()
            }
        }
    },
    Mutation: {
        reportKill(_: any, args: any, context: any) {
            context.Bosses.reportKill(args.name, args.killedOn);
            return context.Bosses.getBoss(args.name);
        }
    }
}

export const schema = { typeDefs, resolvers }

const useServerResetWindow = (boss, serverResetUTC) => {
    console.log('Server Restart detected. Adjusting spawn window');
    let resetDate = new Date(serverResetUTC * 1000);
    let windowOpen = addHours(resetDate, 15);
    let windowCloses = addHours(resetDate, 30);
    return {
        open: Date.now() > windowOpen.getTime(),
        opensOn: windowOpen.getTime(),
        openUntil: windowCloses.getTime()
    }
}