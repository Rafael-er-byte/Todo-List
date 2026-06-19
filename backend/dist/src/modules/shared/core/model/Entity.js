import ResourceNotFound from '../errors/ResourceNotFound';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
export default class Entity {
    constructor(idEntity) {
        this.tmpHistory = [];
        this.idEntity = idEntity;
    }
    addEvent(event) {
        if (!this.deletedAt.exists()) {
            throw new ResourceNotFound("Cannot add event to a deleted entity", { idEntity: this.idEntity.getID() });
        }
        this.tmpHistory.push(event);
        this.lastUpdate = event.getDate();
    }
    create() {
        this.deletedAt = DeletedAt.createActive();
    }
    build(deletedAt) {
        this.deletedAt = deletedAt;
    }
    softDelete() {
        this.deletedAt = DeletedAt.delete();
    }
    pullEvents() {
        const events = this.tmpHistory;
        this.tmpHistory = [];
        return events;
    }
    getLastUpdate() {
        return this.lastUpdate;
    }
    getDeletedAt() {
        return this.deletedAt;
    }
    exists() {
        return this.deletedAt.exists();
    }
    getID() {
        return this.idEntity;
    }
}
//# sourceMappingURL=Entity.js.map