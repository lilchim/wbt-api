
const bosses = new Map<string, any>([
    {
        name: 'Kazzak',
        lastKilled: 1574140920
    },
    {
        name: 'Azuregos',
        lastKilled: 1574313720	
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