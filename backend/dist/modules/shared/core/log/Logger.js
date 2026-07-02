import { LogLevel } from "./Log";
export default class Logger {
    constructor(logLevel, ip, idUser, method, url, requestKey) {
        this.logLevel = LogLevel.METRIC;
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
        this.log.idUser = idUser;
        this.log.date = new Date();
        this.log.method = method;
        this.log.url = url;
        if (requestKey)
            this.log.requestKey = requestKey;
        this.start = performance.now();
        this.logLevel = logLevel;
    }
    info(message, duration) {
        if (this.logLevel > LogLevel.INFO)
            return;
        this.log.events.push({
            type: LogLevel.INFO,
            message: message,
            ...(duration !== undefined && { duration })
        });
    }
    warn(message, duration) {
        if (this.logLevel > LogLevel.WARN)
            return;
        this.log.events.push({
            type: LogLevel.WARN,
            message: message,
            ...(duration !== undefined && { duration })
        });
    }
    error(message, duration) {
        this.log.events.push({
            type: LogLevel.ERROR,
            message: message,
            ...(duration !== undefined && { duration })
        });
    }
    metric(message, duration) {
        if (this.logLevel > LogLevel.METRIC)
            return;
        this.log.events.push({
            type: LogLevel.METRIC,
            message: message,
            ...(duration !== undefined && { duration })
        });
    }
    finish(statusCode) {
        this.log.status = statusCode;
        this.log.duration = performance.now() - this.start;
    }
    print() {
        console.log(this.log);
    }
}
//# sourceMappingURL=Logger.js.map