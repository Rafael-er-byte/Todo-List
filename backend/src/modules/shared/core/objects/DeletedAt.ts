import DateTime from "./DateTime";
import None from "./None";

export default class DeletedAt{
    private deletedAt: DateTime | None;    

    private constructor(deletedAt: DateTime | None) {
        this.deletedAt = deletedAt;
    }

    static createFromPrimitive(date: Date | null): DeletedAt{
        if(date instanceof Date) return DeletedAt.createDeleted(DateTime.create(date));
        return DeletedAt.createActive();
    }

    static createDeleted(date: DateTime): DeletedAt{
        return new DeletedAt(date);
    }

    static createActive(): DeletedAt{
        return new DeletedAt(new None);
    }

    public exists(): boolean {
        return this.deletedAt instanceof None;
    }

    public getDeletedTime(): DateTime | None {
        return this.deletedAt;
    }

    public static delete(): DeletedAt {
        return new DeletedAt(DateTime.now());
    }

    public toPrimitive(): Date | null{
        return this.exists()? null: (this.getDeletedTime() as DateTime).getDate() as Date
    }
}
