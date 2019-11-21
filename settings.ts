export const authKeys = new Map<string, string>([
    {
        guild: 'Mandate of Heaven',
        token: '123'
    },
    {
        guild: 'gusy',
        token: '321'
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