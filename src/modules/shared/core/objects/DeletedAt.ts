import DateTime from "./DateTime";
import None from "./None";

export default class DeletedAt{
    private deletedAt: DateTime | None;    

    constructor(deletedAt: DateTime | None) {
        this.deletedAt = deletedAt;
    }

    public exists(): boolean {
        return this.deletedAt instanceof None;
    }

    public getDeletedTime(): Date | None {
        return this.deletedAt instanceof DateTime ? this.deletedAt.getDate() : new None();
    }

    public delete(): DeletedAt {
        return new DeletedAt(DateTime.now());
    }
}
