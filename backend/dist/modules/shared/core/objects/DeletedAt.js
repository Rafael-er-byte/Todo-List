import DateTime from "./DateTime";
import None from "./None";
export default class DeletedAt {
    constructor(deletedAt) {
        this.deletedAt = deletedAt;
    }
    static createFromPrimitive(date) {
        if (date instanceof Date)
            return DeletedAt.createDeleted(DateTime.create(date));
        return DeletedAt.createActive();
    }
    static createDeleted(date) {
        return new DeletedAt(date);
    }
    static createActive() {
        return new DeletedAt(new None);
    }
    exists() {
        return this.deletedAt instanceof None;
    }
    getDeletedTime() {
        return this.deletedAt;
    }
    static delete() {
        return new DeletedAt(DateTime.now());
    }
    toPrimitive() {
        return this.exists() ? null : this.getDeletedTime().getDate();
    }
}
//# sourceMappingURL=DeletedAt.js.map