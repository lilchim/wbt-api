
const bosses = new Map<string, any>([
    {
        name: 'Kazzak',
        lastKilled: 1574358600
    },
    {
        name: 'Azuregos',
        lastKilled: 1574355600	
    }
].map(b => [b.name, b]));

export interface Boss {
    name: string;
    lastKilled: number;
}

export const generateBossModel = ({ req }) => ({
    getBoss: (name) => { return bosses.get(name)},
    reportKill: (name, killedOn) => {
        let boss = bosses.get(name);
        boss.lastKilled = killedOn;
        return boss;
    }
});