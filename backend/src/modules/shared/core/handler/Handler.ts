import type { DTO } from "./DTO";

export default interface Handler{
    execute(data: DTO): DTO;
}
