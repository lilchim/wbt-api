import {clique, authKeys } from '../settings';

const players = new Map<string, any>();

export interface Player {
    name: string;
    class: string;
    role: string;
    scouting: string;
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
    startScouting: ({name, bossName}) => {
        let p = players.get(name);
        p.scouting = bossName;
        return p;
    },
    stopScouting: ({name}) => {
        let p = players.get(name);
        p.scouting = undefined;
        return p;
    },
    getScouts: ({bossName}) => {
        const allPlayers = Array.from(players.values());
        return allPlayers.filter(p => { return p.scouting === bossName})
    },

})