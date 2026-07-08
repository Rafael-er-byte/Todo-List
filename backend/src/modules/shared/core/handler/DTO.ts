import type Logger from "../log/Logger";

export interface DTO {
    chronLog: Logger
}

interface DomainActionDTO extends DTO{
    idMember: string;
    idProject?: string;
}

export interface CommandDto extends DomainActionDTO{
    key?:string;
}
