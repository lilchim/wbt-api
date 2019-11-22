import {clique, authKeys } from '../settings';

const players = new Map<string, any>();

export interface Player {
    name: string;
    class: string;
    role: string;
    scouting: string;
    scoutingSince: number;
    guild: string;
    discordTag: string;
}

export const generatePlayerModel = ({req}) => ({
    authorizeUser: ({token}) => {
        let guild = authKeys.get(token);
        if(guild) {
            return {
                guild: guild
            }
        }
        return undefined;
    },
    registerPlayer: (player: Player) => {
        console.log(player);
        players.set(player.name, player);
        return players.get(player.name);
    },
    getPlayer: ({name}) => players.get(name),
    getPlayers: () => Array.from(players.values()),
    getRole: ({name}) => {
        if(clique.indexOf(name) > -1) {
            return 'CLIQUE'
        }
        return 'FODDER';
    },
    startScouting: ({name, bossName, startTime}) => {
        console.log(name);
        let p = players.get(name);
        console.log('toggling scouting for p', p);

        p.scouting = bossName;
        p.scoutingSince = startTime;
        return p;
    },
    stopScouting: ({name}) => {
        let p = players.get(name);
        p.scouting = undefined;
        return p;
    },
    getScouts: ({name}) => {
        const allPlayers = Array.from(players.values());
        console.log(allPlayers);
        let res= allPlayers.filter(p => { 
            console.log(p.scouting);
            console.log(name);
            return p.scouting === name})
        console.log(res);
        return res;
    },

})