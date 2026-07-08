import type { DTO } from "../../../../shared/core/handler/DTO";

export default interface AuthenticationDto extends DTO{
    code: string;
    timezone: string;
}
