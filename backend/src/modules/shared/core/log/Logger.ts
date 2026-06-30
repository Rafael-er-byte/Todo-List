import type Log from "./Log";

export default class Logger{
    log!: Log;
    start!: number;
    
    constructor(
        ip: string,
        idUser: string,
        method: string,
        url: string,
        requestKey?: string,
    ){
        this.log.ip = ip;
        this.log.idUser = idUser;
        this.log.date = new Date();
        this.log.method = method;
        this.log.url = url;
        if(requestKey)this.log.requestKey = requestKey;
        this.start = performance.now();
    }

    info(message:string, duration?: number){
        this.log.events.push({
                            type: "INFO", 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    warn(message:string, duration?: number){
        this.log.events.push({
                            type: "WARN", 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    error(message:string, duration?: number){
        this.log.events.push({
                            type: "ERROR", 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    metric(message:string, duration: number){
        this.log.events.push({
                            type: "METRIC", 
                            message: message, 
                            ...(duration !== undefined && {duration})
                        });
    }

    finish(statusCode: number){
        this.log.status = statusCode;
        this.log.duration = performance.now() - this.start;
    }

    print(){
        console.log(this.log);
    }
}
