export default class DomainEvent {
    constructor(eventId, eventDate, actor, idEntity, event, info) {
        this.actor = actor;
        this.event = event;
        this.eventDate = eventDate;
        if (info)
            this.info = info;
        this.eventId = eventId;
        this.idEntity = idEntity;
    }
    getActor() {
        return this.actor;
    }
    getDate() {
        return this.eventDate;
    }
    getEvent() {
        return this.event;
    }
    getInfo() {
        return this.info;
    }
    getId() {
        return this.eventId;
    }
    getIdEntity() {
        return this.idEntity;
    }
}
//# sourceMappingURL=DomainEvent.js.map