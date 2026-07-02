import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import None from '../../../../shared/core/objects/None';
import Text from '../../../../shared/core/objects/Text';
import Url from '../../../../shared/core/objects/URL';
import DateTime from '../../../../shared/core/objects/DateTime';
import type LinkParams from '../interfaces/LinkParams';
import LinkId from '../objects/LinkId';
import LinkCreated from '../events/LinkCreated';
import LinkDeleted from '../events/LinkDeleted';
import LinkVisibleTextUpdated from '../events/LinkVisibleTextUpdated';

export default class Link extends Entity {
  private task!: IdEntity;
  private url!: Url;
  private visibleText!: Text | None;

  private constructor(id: LinkId, task: IdEntity, url: Url, visibleText: Text | None) {
    super(id);
    this.task = task;
    this.url = url;
    this.visibleText = visibleText;
  }

  public static create(
    params: LinkParams & { key: string; actor: string },
  ): Link {
    const id = new LinkId(params.id);
    const task = new IdEntity(params.idTask);
    const url = new Url(params.url);
    const actor = new IdEntity(params.actor);
    const visibleText = params.visibleText ? new Text(params.visibleText) : undefined;
    const link = new Link(id, task, url, visibleText ?? new None());
    link.addEvent(new LinkCreated(params.key, DateTime.now(), actor, task, id, link.toPrimitives()));
    return link;
  }

  public static fromPrimitives(params: LinkParams): Link {
    const link = new Link(
      new LinkId(params.id),
      new IdEntity(params.idTask),
      new Url(params.url),
      params.visibleText ? new Text(params.visibleText) : new None(),
    );

    return link;
  }

  public getId(): LinkId {
    return super.getID() as LinkId;
  }

  public getTaskId(): IdEntity {
    return this.task;
  }

  public getUrl(): Url {
    return this.url;
  }

  public getVisibleText(): Text | None {
    return this.visibleText;
  }

  public updateVisibleText(key: string, visibleText: Text, actor: IdEntity): void {
    this.visibleText = visibleText;
    this.addEvent(
      new LinkVisibleTextUpdated(key, DateTime.now(), actor, this.getTaskId(), this.getId(), visibleText),
    );
  }

  public delete(key: string, actor: IdEntity): void {
    this.addEvent(new LinkDeleted(key, DateTime.now(), actor, this.getTaskId(), this.getId()));
  }

  public toPrimitives(): LinkParams {
    return {
      id: this.getId().toString(),
      idTask: this.getTaskId().toString(),
      url: this.url.getUrl(),
      visibleText: this.visibleText instanceof None ? null : this.visibleText.getText(),
    };
  }
}
