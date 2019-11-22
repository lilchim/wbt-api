export const authKeys = new Map<string, string>([
    {
        guild: 'Mandate of Heaven',
        token: '18d780c3-b7ca-4ea5-bd98-6ad60256d9e9'
    },
    {
        guild: 'gusy',
        token: '78123c3f-4eb0-4b28-9c97-59dd0fa16ca7'
    }
].map(a => [a.token, a.guild]))

export const clique = [
    'Goshu',
    'Manlet',
    'Infamy',
    'Vurt',
    'Neksi',
    'Sypha',
]

export default { authKeys, clique }