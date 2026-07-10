type Event = {
    type: LogLevel,
    message: string,
    duration?: number,
    info?: unknown
}

export enum LogLevel{
    "INFO",
    "METRIC",
    "WARN",
    "ERROR"
}

export default interface Log{
    ip: string;
    date: Date;
    duration: number;
    method: string;
    url: string;
    idUser?: string;
    requestKey?: string;
    events: Event[];
    status: number;
}
