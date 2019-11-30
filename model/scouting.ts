import { v4 as uuidv4 } from 'uuid';
import { uniqBy } from 'lodash';


export interface ScoutingLog {
    _id: string;
    startTime?: number;
    stopTime?: number;
    scoutId: string;
    targetId: string;
}

const DEFAULT_SCOUT_TIME = 3600

export const generateScoutingModel = ({ req, client }) => ({
    /**
     * Gets all scouting logs for a given boss
     * Accepts `since` and `until` parameters to filter based on startTime
     */
    getLogsForTarget: async (bossId, since, until) => {
        console.log('finding scouts for boss with id ', bossId);
        let logsInRange = await client.db('wbt-data').collection('scouting-logs')
            .find(
                {
                    target: bossId,
                    startTime: { $gte: since, $lte: until }
                },

            ).toArray()
        console.log(logsInRange);
        return logsInRange
    },
    /**
     * Records a new scouting session
     */
    startScouting: async (session: ScoutingLog) => {
        console.log('Recording scouting session')
        let log: ScoutingLog = {
            ...session,
            _id: uuidv4(),
            startTime: session.startTime ? session.startTime : Math.floor(Date.now() / 1000),
            stopTime: session.stopTime ? session.stopTime : Math.floor(Date.now() / 1000) + DEFAULT_SCOUT_TIME
        };

        let result = await client.db('wbt-data').collection('scouting-logs').insertOne(log);
        return log;
    },
    /**
     * Ends a scouting session by recording the stopTime
     * Can be used to update the stop time of historical scouting sessions
     */
    stopScouting: async ({ sessionId, stopTime }) => {
        let updatedSession = await client.db('wbt-data').collection('scouting-logs')
            .findOneAndUpdate(
                { _id: sessionId },
                { $set: { stopTime: stopTime }}
            );
        console.log(updatedSession);
        return updatedSession;
    },
    /**
     * Gets all logs for a given scout and target
     */
    getLogsByScoutId: async (scoutId, targetId) => {
        const sessions = await client.db('wbt-data').collection('scouting-logs')
            .find(
                {
                    scoutId: scoutId,
                    targetId: targetId
                }
            ).toArray();
    },
    /**
     * Gets a single ScoutLog for a given scout and target
     * The returned log will be the most current, where current Unix time does not exceed the stopTime of the session
     */
    getCurrentSessionForScout: async ({ _id }) => {
        console.log(`Getting current Scouting session for scout with id ${_id}`)
        const currentSession = await client.db('wbt-data').collection('scouting-logs')
            .findOne( // Find logs for this scout  where the stopTime is greater than current unix time
                {
                    scoutId: _id,
                    stopTime: { $gte: Math.floor(Date.now() / 1000) }
                },
            )
        console.log(currentSession);
        return currentSession;
    },
    getActiveScoutsForTarget: async ({ _id }) => {
        const currentSessions = await client.db('wbt-data').collection('scouting-logs')
            .find(
                {
                    targetId: _id,
                    stopTime: { $gte: Math.floor(Date.now() / 1000) }
                }
            )
            .sort({ startTime: -1 })
            .toArray();
        console.log('current scouting sessions: ', currentSessions);
        const uniqueByScout = uniqBy(currentSessions, 'session.scoutId');
        console.log('unique by scout', uniqueByScout);
        const activeScouts = uniqueByScout.map(log => log.scoutId);
        console.log('active scouts: ', activeScouts);
        return activeScouts;
    }

})