enum Roles {
    OFFICER = 'OFFICER',
    MEMBER = 'MEMBER'
}

export const authKeys = new Map<string, any>([
    {
        guild: 'Mandate of Heaven',
        token: '18d780c3-b7ca-4ea5-bd98-6ad60256d9e9',
        role: Roles.MEMBER
    },
    {
        guild: 'Mandate of Heaven',
        token: '18d780c3-b7ca-4ea5-bd98-6ad60256d9e0',
        role: Roles.OFFICER
    },
    {
        guild: 'gusy',
        token: '78123c3f-4eb0-4b28-9c97-59dd0fa16ca7',
        role: Roles.MEMBER
    },
    {
        guild: 'gusy',
        token: '78123c3f-4eb0-4b28-9c97-59dd0fa16ca8',
        role: Roles.OFFICER
    }
].map(a => [a.token, a]))


export const clique = [
    'Goshu',
    'Manlet',
    'Infamy',
    'Vurt',
    'Neksi',
    'Sypha',
] 

export default { authKeys, clique }