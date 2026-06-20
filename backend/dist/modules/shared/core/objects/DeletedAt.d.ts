import DateTime from "./DateTime";
import None from "./None";
export default class DeletedAt {
    private deletedAt;
    private constructor();
    static createFromPrimitive(date: Date | null): DeletedAt;
    static createDeleted(date: DateTime): DeletedAt;
    static createActive(): DeletedAt;
    exists(): boolean;
    getDeletedTime(): DateTime | None;
    static delete(): DeletedAt;
    toPrimitive(): Date | null;
}
//# sourceMappingURL=DeletedAt.d.ts.map