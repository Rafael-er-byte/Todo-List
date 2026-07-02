import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import None from '../../../../shared/core/objects/None';
import Text from '../../../../shared/core/objects/Text';
import Url from '../../../../shared/core/objects/URL';
import DateTime from '../../../../shared/core/objects/DateTime';
import LinkId from '../objects/LinkId';
import LinkCreated from '../events/LinkCreated';
import LinkDeleted from '../events/LinkDeleted';
import LinkVisibleTextUpdated from '../events/LinkVisibleTextUpdated';
export default class Link extends Entity {
    constructor(id, task, url, visibleText) {
        super(id);
        this.task = task;
        this.url = url;
        this.visibleText = visibleText;
    }
    static create(params) {
        const id = new LinkId(params.id);
        const task = new IdEntity(params.idTask);
        const url = new Url(params.url);
        const actor = new IdEntity(params.actor);
        const visibleText = params.visibleText ? new Text(params.visibleText) : undefined;
        const link = new Link(id, task, url, visibleText ?? new None());
        link.addEvent(new LinkCreated(params.key, DateTime.now(), actor, task, id, link.toPrimitives()));
        return link;
    }
    static fromPrimitives(params) {
        const link = new Link(new LinkId(params.id), new IdEntity(params.idTask), new Url(params.url), params.visibleText ? new Text(params.visibleText) : new None());
        return link;
    }
    getId() {
        return super.getID();
    }
    getTaskId() {
        return this.task;
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
    }
    toPrimitives() {
        return {
            id: this.getId().getID(),
            idTask: this.getTaskId().getID(),
            url: this.url.getUrl(),
            visibleText: this.visibleText instanceof None ? null : this.visibleText.getText(),
        };
    }
}
//# sourceMappingURL=Link.js.map