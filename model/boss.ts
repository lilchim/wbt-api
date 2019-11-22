

const bosses = new Map<string, any>([
    {
        id: 0,
        name: 'Kazzak',
        lastKilled: 1574358600,
        alive: false
    },
    {
        id: 1,
        name: 'Azuregos',
        lastKilled: 1574355600,
        alive: true
    }
].map(b => [b.name, b]));

export interface Boss {
    id: any;
    name: string;
    // Timestamp stored in Seconds (Unix Epoch time, or UTC Seconds)
    lastKilled: number;
}

export const generateBossModel = ({ req }) => ({
    getBoss: (name) => { return bosses.get(name)},
    getBosses: () => { return Array.from(bosses.values())},
    reportKill: ({name, killedOn}) => {
        let boss = bosses.get(name);
        boss.lastKilled = killedOn;
        return boss;
    }
});