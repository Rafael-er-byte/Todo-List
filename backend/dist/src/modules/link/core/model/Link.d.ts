import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import None from '../../../shared/core/objects/None';
import Text from '../../../shared/core/objects/Text';
import Url from '../../../shared/core/objects/URL';
import type LinkParams from '../interfaces/LinkParams';
import LinkId from '../objects/LinkId';
export default class Link extends Entity {
    private task;
    private url;
    private visibleText;
    private constructor();
    static create(id: LinkId, task: IdEntity, url: Url, key: string, actor: IdEntity, visibleText?: Text): Link;
    static fromPrimitives(params: LinkParams): Link;
    getId(): LinkId;
    getTaskId(): IdEntity;
    getUrl(): Url;
    getVisibleText(): Text | None;
    updateVisibleText(key: string, visibleText: Text, actor: IdEntity): void;
    delete(key: string, actor: IdEntity): void;
    toPrimitives(): LinkParams;
}
//# sourceMappingURL=Link.d.ts.map