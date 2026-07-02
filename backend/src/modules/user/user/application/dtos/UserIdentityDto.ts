import type { DTO } from "../../../../shared/core/handler/DTO";

export default interface UserIdentityDto extends DTO{
    token: string;
}
