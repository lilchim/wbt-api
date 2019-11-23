
const players = new Map<string, any>();

export interface Player {
    id: string;
    name: string;
    characterClass: string;
    token: string;
    role: string;
    scouting: string;
    scoutingSince: number;
    guild: string;
    discordTag: string;
}

export const generatePlayerModel = ({ req }) => ({
    updatePlayerInfo: (player) => {
        console.log('updating player info for', player);
        let p = players.get(player.id);
        if (!p) {
            console.log('This is a new player');
        }
        players.set(player.id, player);
        return player;
    },
    getById: ({ id }) => players.get(id),
    getAll: () => Array.from(players.values()),
    startScouting: ({id, bossName, startTime }) => {
        let p = players.get(id);
        p.scouting = bossName;
        p.scoutingSince = startTime;
        return p;
    },
    startScoutingv1: ({ name, bossName, startTime }) => {
        console.log(name);
        let p = players.get(name);
        console.log('toggling scouting for p', p);

        p.scouting = bossName;
        p.scoutingSince = startTime;
        return p;
    },
    stopScouting: ({ name }) => {
        let p = players.get(name);
        p.scouting = undefined;
        return p;
    },
    getScouts: ({ name }) => {
        const allPlayers = Array.from(players.values());
        let res = allPlayers.filter(p => {
            console.log(p.scouting);
            console.log(name);
            return p.scouting === name
        })
        return res;
    },

})