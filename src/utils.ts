export function assertExist(val: unknown, message : string | Error = "val does not exists") {
    if (val === undefined || val === null) {
        if(message instanceof Error) {
            throw message 
        }
        throw new Error(message);
    } 
}