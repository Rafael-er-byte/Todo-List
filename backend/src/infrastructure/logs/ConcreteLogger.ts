import type { LogLevel } from "../../modules/shared/core/log/Log";
import Logger from "../../modules/shared/core/log/Logger";

export default class ConcreteLogger extends Logger{
    constructor(  
        logLevel: LogLevel,
        ip: string,
        method: string,
        url: string,
        idUser?: string,
        requestKey?: string,){
        
        super(
            logLevel,
            ip,
            method,
            url,
            idUser,
            requestKey
        );
    }

    save(): Promise<void> | void{
        console.log('TRACE: ', this.log);
    }
}
