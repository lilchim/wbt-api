var lastReset = 0;

export const generateServerModel = ({req}) => ({
    logServerReset: (resetTime) => { lastReset = resetTime },
    lastReset: () => { return lastReset }
})