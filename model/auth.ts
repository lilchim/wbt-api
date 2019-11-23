import { Roles } from "../settings";
import { v4 as uuidv4 } from 'uuid';


export const generateAuthModel = ({req, officers, authKeys, registeredUsers}) => ({
    getRegisteredUsers: () => { return Array.from(registeredUsers.values())},
    getRole: ({token}) => { return authKeys.get(token).role },
    isAuthorized: ({ name, token }) => {
        console.log('Checking authorization for ', name);
        let auth = authKeys.get(token);
        return auth && registeredUsers.has(name);
    },
    registerUser: ({name, token}) => {
        let auth = authKeys.get(token);
        
        console.log(name, token);
        if ( auth && registeredUsers.has(name)) {
            console.log('This player is already registered');
            return registeredUsers.get(name);
        }
        let result = {
            id: uuidv4(),
            token: token,
            name: name,
            role: auth.role,
            guild: auth ? auth.guild : '',
            success: auth ? true : false
        }
        console.log(result);
        if(auth && auth.role === Roles.OFFICER) {
            console.log('Officer role requires whitelist');
            if (officers.indexOf(name) < 0) {
                result.success = false;
            }
        }

        if(result.success) {
            registeredUsers.set(name, result);
        }
        return result;
    },
    // registerUserv1: ({ name, token }) => {
    //     let auth = authKeys.get(token);
        
    //     let result = {
    //         guild: auth ? auth.guild : '',
    //         success: auth ? true : false
    //     }
    //     console.log(result);
    //     if(auth && auth.role === Roles.OFFICER) {
    //         console.log('Officer role requires whitelist');
    //         if (officers.indexOf(name) < 0) {
    //             result.success = false;
    //         }
    //     }

    //     // add them to the list of players
    //     if(result.success && !registeredUsers.has(name)) {
    //         let id = uuidv4();
    //         const player = {
    //             id: id,
    //             name: name,
    //             token: token
    //         }
    //         players.set(player.id, player)
    //         registeredUsers.set(name, player.id);
    //     }

    //     return result;
    // },
})