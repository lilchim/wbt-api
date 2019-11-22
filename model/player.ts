import {clique, authKeys } from '../settings';

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

export const generatePlayerModel = ({req}) => ({
    authorizeUser: ({token}) => {
        let guild = authKeys.get(token);
        return guild ? true : false;
    },
    registerPlayer: ({name, characterClass, token}) => {
        let player = {
            id: Math.floor(Math.random() * 100).toString(),
            name: name,
            characterClass: characterClass,
            token: token,
            guild: authKeys.get(token).guild
        }
        console.log(player);
        players.set(player.id, player);
        return players.get(player.id);
    },
    getById: ({id}) => players.get(id),
    getAll: () => Array.from(players.values()),
    getRole: ({id}) => {
        let p = players.get(id);
        console.log('Finding role for ', p);
        let auth = authKeys.get(p.token);
        return auth.role
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