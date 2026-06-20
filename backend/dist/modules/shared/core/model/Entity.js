import DateTime from '../objects/DateTime';
export default class Entity {
    constructor(idEntity) {
        this.tmpHistory = [];
        this.idEntity = idEntity;
    }
    addEvent(event) {
        this.tmpHistory.push(event);
        this.lastUpdate = event.getDate();
    }
    pullEvents() {
        const events = this.tmpHistory;
        this.tmpHistory = [];
        return events;
    }
    getLastUpdate() {
        return this.lastUpdate;
    }
    getID() {
        return this.idEntity;
    }
}
//# sourceMappingURL=Entity.js.map