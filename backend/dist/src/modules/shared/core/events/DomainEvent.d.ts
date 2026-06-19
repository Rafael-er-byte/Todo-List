import type DateTime from '../objects/DateTime';
import type IdEntity from '../objects/IdEntity';
import type None from '../objects/None';
export default class DomainEvent {
    private eventId;
    private eventDate;
    private actor;
    private event;
    private idEntity;
    private info?;
    constructor(eventId: string, eventDate: DateTime, actor: IdEntity | None, idEntity: IdEntity, event: string, info?: unknown);
    getActor(): IdEntity | None;
    getDate(): DateTime;
    getEvent(): string;
    getInfo(): unknown;
    getId(): string;
    getIdEntity(): IdEntity;
}
//# sourceMappingURL=DomainEvent.d.ts.map