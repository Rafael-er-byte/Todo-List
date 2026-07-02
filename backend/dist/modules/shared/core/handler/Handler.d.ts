import type { DTO } from "./DTO";
export default interface Handler<TInput extends DTO, TOutput> {
    execute(data: TInput): Promise<TOutput>;
}
//# sourceMappingURL=Handler.d.ts.map