export const addHours = (date, h) => {
    var copiedDate = new Date(date.getTime());
    copiedDate.setTime(copiedDate.getTime() + (h*60*60*1000));
    return copiedDate;
}