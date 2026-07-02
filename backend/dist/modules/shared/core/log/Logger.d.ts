import type Log from "./Log";
import { LogLevel } from "./Log";
export default class Logger {
    log: Log;
    start: number;
    private logLevel;
    constructor(logLevel: LogLevel, ip: string, idUser: string, method: string, url: string, requestKey?: string);
    info(message: string, duration?: number): void;
    warn(message: string, duration?: number): void;
    error(message: string, duration?: number): void;
    metric(message: string, duration?: number): void;
    finish(statusCode: number): void;
    print(): void;
}
//# sourceMappingURL=Logger.d.ts.map