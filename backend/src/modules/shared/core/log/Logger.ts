import type Log from "./Log";
import { LogLevel } from "./Log";

export default class Logger{
    log!: Log;
    start!: number;
    private logLevel: LogLevel = LogLevel.METRIC;
    
    constructor(
        logLevel: LogLevel,
        ip: string,
        method: string,
        url: string,
        idUser?: string,
        requestKey?: string,
    ){
        this.log = {
            ip: "",
            idUser: "",
            date: new Date(),
            duration: 0,
            method: "",
            url: "",
            events: [],
            status: 0,
        };
        this.log.ip = ip;
        this.log.date = new Date();
        this.log.method = method;
        this.log.url = url;
        if(idUser)this.log.idUser = idUser;
        if(requestKey)this.log.requestKey = requestKey;
        this.start = performance.now();
        this.logLevel = logLevel;
    }

    info(message:string, duration?: number){
        if(this.logLevel > LogLevel.INFO)return;
        this.log.events.push({
                            type: LogLevel.INFO, 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    warn(message:string, duration?: number){
        if(this.logLevel > LogLevel.WARN)return;
        this.log.events.push({
                            type: LogLevel.WARN, 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    error(message:string, duration?: number){
        this.log.events.push({
                            type: LogLevel.ERROR, 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    metric(message:string, duration?: number){
        if(this.logLevel > LogLevel.METRIC)return;
        this.log.events.push({
                            type: LogLevel.METRIC, 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    finish(statusCode: number){
        this.log.status = statusCode;
        this.log.duration = performance.now() - this.start;
    }

    save(){
        console.log(this.log);
    }
}
