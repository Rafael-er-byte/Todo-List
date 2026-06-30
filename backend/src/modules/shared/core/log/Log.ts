type Event = {
    type: "ERROR" | "WARN" | "INFO" | "METRIC",
    message: string,
    duration?: number,
}

export default interface Log{
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
