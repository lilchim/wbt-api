export const addHours = (date, h) => {
    var copiedDate = new Date(date.getTime());
    copiedDate.setTime(copiedDate.getTime() + (h*60*60*1000));
    return copiedDate;
}

export const UTCTimestampSeconds = (date ?: Date) => {
    if(date) {
        return Math.floor(date.getTime() / 1000);
    }

    return Math.floor(Date.now() / 1000);
}