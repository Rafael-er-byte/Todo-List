import type { CommandDto } from "../../../../shared/core/handler/DTO";

export default interface AutenticationDto extends CommandDto{
    code: string;
}
