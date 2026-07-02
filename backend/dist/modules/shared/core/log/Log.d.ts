type Event = {
    type: LogLevel;
    message: string;
    duration?: number;
};
export declare enum LogLevel {
    "INFO" = 0,
    "METRIC" = 1,
    "WARN" = 2,
    "ERROR" = 3
}
export default interface Log {
    ip: string;
    idUser: string;
    date: Date;
    duration: number;
    method: string;
    url: string;
    requestKey?: string;
    events: Event[];
    status: number;
}
export {};
//# sourceMappingURL=Log.d.ts.map