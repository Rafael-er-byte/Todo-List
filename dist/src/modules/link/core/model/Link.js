import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import None from '../../../shared/core/objects/None';
import Text from '../../../shared/core/objects/Text';
import Url from '../../../shared/core/objects/URL';
import DateTime from '../../../shared/core/objects/DateTime';
import Version from '../../../shared/core/objects/Version';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import LinkId from '../objects/LinkId';
import LinkCreated from '../events/LinkCreated';
import LinkDeleted from '../events/LinkDeleted';
import LinkVisibleTextUpdated from '../events/LinkVisibleTextUpdated';
export default class Link extends Entity {
    constructor(id, task, url, visibleText) {
        super(id, task);
        this.url = url;
        this.visibleText = visibleText;
    }
    static create(id, task, url, key, actor, visibleText) {
        const link = new Link(id, task, url, visibleText ?? new None());
        link.create();
        link.addEvent(new LinkCreated(key, DateTime.now(), actor, task, id, link.toPrimitives()));
        return link;
    }
    static fromPrimitives(params) {
        const link = new Link(new LinkId(params.id), new IdEntity(params.idTask), new Url(params.url), params.visibleText ? new Text(params.visibleText) : new None());
        link.build(new Version(params.version), DeletedAt.createFromPrimitive(params.deletedAt));
        return link;
    }
    getId() {
        return super.getID();
    }
    getTaskId() {
        return super.getOwner();
    }
    getUrl() {
        return this.url;
    }
    getVisibleText() {
        return this.visibleText;
    }
    updateVisibleText(key, visibleText, actor) {
        this.visibleText = visibleText;
        this.addEvent(new LinkVisibleTextUpdated(key, DateTime.now(), actor, this.getTaskId(), this.getId(), visibleText));
    }
    delete(key, actor) {
        this.addEvent(new LinkDeleted(key, DateTime.now(), actor, this.getTaskId(), this.getId()));
        super.softDelete();
    }
    toPrimitives() {
        return {
            id: this.getId().getID(),
            idTask: this.getTaskId().getID(),
            url: this.url.getUrl(),
            visibleText: this.visibleText instanceof None ? null : this.visibleText.getText(),
            version: super.getVersion().valueOf(),
            deletedAt: super.getDeletedAt().toPrimitive(),
        };
    }
}
//# sourceMappingURL=Link.js.map