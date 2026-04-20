import DateTime from "../../../../../src/modules/shared/core/objects/DateTime";
import DeletedAt from "../../../../../src/modules/shared/core/objects/DeletedAt";
import None from "../../../../../src/modules/shared/core/objects/None";

describe('DeletedAt', () => {
    it('should create a DeletedAt object for an existing entity', () => {
        const deletedAt = new DeletedAt(new None());
        expect(deletedAt.exists()).toBe(true);
    });

    it('Should create a DeletedAt object for a deleted entity', () => {
        const deletedAt = new DeletedAt(DateTime.now());
        expect(deletedAt.exists()).toBe(false);
    });

    it('should return the deleted time for a deleted entity', () => {
        const now = DateTime.now();
        const deletedAt = new DeletedAt(now);
        expect(deletedAt.getDeletedTime()).toEqual(now.getDate());
    });

    it('should return None for an existing entity', () => {
        const deletedAt = new DeletedAt(new None());
        expect(deletedAt.getDeletedTime()).toBeInstanceOf(None);
    });

    it('Should created a DeletedAt object with the delete static method', () => {
        const deletedAt = DeletedAt.delete();
        expect(deletedAt.exists()).toBe(false);
        expect(deletedAt.getDeletedTime()).toBeInstanceOf(Date);
    });
});