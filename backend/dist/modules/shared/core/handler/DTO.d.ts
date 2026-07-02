import type Logger from "../log/Logger";
export type DTO = Record<string, unknown>;
interface DomainActionDTO extends DTO {
    idMember: string;
    chronLog: Logger;
    idProject?: string;
}
export interface CommandDto extends DomainActionDTO {
    key?: string;
}
export interface QueryDTO extends DomainActionDTO {
}
export interface ResultActionDTO extends DTO {
    success: boolean;
    data?: Record<string, unknown>;
}
export {};
//# sourceMappingURL=DTO.d.ts.map