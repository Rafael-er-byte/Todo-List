import ResourceNotFound from '../errors/ResourceNotFound';
import Unauthorized from '../errors/Unauthorized';
import DateTime from '../objects/DateTime';
import DeletedAt from '../objects/DeletedAt';
import None from '../objects/None';
import Version from '../objects/Version';
export default class Entity {
    constructor(idEntity, owner) {
        this.tmpHistory = [];
        this.idEntity = idEntity;
        this.owner = owner;
    }
    addEvent(event) {
        if (!this.deletedAt.exists()) {
            throw new ResourceNotFound("Cannot add event to a deleted entity", { idEntity: this.idEntity.getID() });
        }
        this.tmpHistory.push(event);
        this.lastUpdate = event.getDate();
        this.version = this.version.increment();
    }
    create() {
        this.version = new Version(0);
        this.deletedAt = DeletedAt.createActive();
    }
    build(version, deletedAt) {
        this.version = version;
        this.deletedAt = deletedAt;
    }
    softDelete() {
        this.deletedAt = DeletedAt.delete();
    }
    changeOwner(newOwner) {
        this.owner = newOwner;
    }
    pullEvents() {
        const events = this.tmpHistory;
        this.tmpHistory = [];
        return events;
    }
    ownership(child) {
        const isOwned = child.getOwner() instanceof None ? false : child.getOwner() === this.idEntity;
        if (!isOwned)
            throw new Unauthorized(`Resource ${child.getID()} is not owned by ${this.idEntity}`, child);
        return true;
    }
    getLastUpdate() {
        return this.lastUpdate;
    }
    getVersion() {
        return this.version;
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
    getOwner() {
        return this.owner;
    }
}
//# sourceMappingURL=Entity.js.map