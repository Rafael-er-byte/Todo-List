export type DTO = Record<string, unknown>;

interface DomainActionDTO extends DTO{
    idMember: string;
    idProject?: string;
}

export interface CommandDto extends DomainActionDTO{
    key?:string;
}

export interface QueryDTO extends DomainActionDTO{}
