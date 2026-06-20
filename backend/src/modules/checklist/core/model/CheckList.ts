import Entity from '../../../shared/core/model/Entity';
import DateTime from '../../../shared/core/objects/DateTime';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Text from '../../../shared/core/objects/Text';
import type CheckListParams from '../interfaces/CheckListParams';
import ChecklistItem from '../objects/ChecklistItem';
import IdCheckList from '../objects/IdCheckList';
import CheckListCreated from '../events/CheckListCreated';
import CheckListDeleted from '../events/CheckListDeleted';
import CheckListTitleUpdated from '../events/CheckListTitleUpdated';
import ChecklistItemCreated from '../events/ChecklistItemCreated';
import ChecklistItemDeleted from '../events/ChecklistItemDeleted';
import ChecklistItemCompleted from '../events/ChecklistItemCompleted';
import ChecklistItemMarkedAsPending from '../events/ChecklistItemMarkedAsPending';
import ChecklistItemTitleUpdated from '../events/ChecklistItemTitleUpdated';
import ResourceNotFound from '../../../shared/core/errors/ResourceNotFound';
import PercentageCompleted from '../objects/PercentageCompleted';
import CheckListName from '../objects/CheckListName';

export default class CheckList extends Entity {
  private task!: IdEntity;
  private name!: CheckListName;
  private items: ChecklistItem[] = [];
  private completedPercentage!: PercentageCompleted;

  private constructor(id: IdCheckList, task: IdEntity, name: CheckListName, items: ChecklistItem[], completedPercentage: PercentageCompleted) {
    super(id);
    this.task = task;
    this.name = name;
    this.items = items;
    this.completedPercentage = completedPercentage;
  }

  public static create(
    id: IdCheckList,
    owner: IdEntity,
    name: CheckListName,
    actor: IdEntity,
    key: string,
    items: ChecklistItem[] = [],
  ): CheckList {
    const checklist = new CheckList(id, owner, name, items, new PercentageCompleted(0));
    checklist.recalculateCompletedPercentage();
    checklist.addEvent(new CheckListCreated(key, DateTime.now(), actor, checklist.getTaskId(), id, checklist.toPrimitives()));
    return checklist;
  }

  public static fromPrimitives(params: CheckListParams): CheckList {
    const items = params.items.map((item) => ChecklistItem.fromPrimitives(item));
    const checklist = new CheckList(
      new IdCheckList(params.id),
      new IdEntity(params.idOwner),
      new CheckListName(params.name),
      items,
      new PercentageCompleted(params.completedPercentage),
    );

    return checklist;
  }

  public getName(): CheckListName {
    return this.name;
  }

  public getItems(): ChecklistItem[] {
    return [...this.items];
  }

  public getCompletedPercentage(): PercentageCompleted {
    return this.completedPercentage;
  }

  private getTaskId(): IdEntity {
    return this.task;
  }

  public updateName(name: CheckListName, actor: IdEntity, key: string): void {
    this.name = name;
    this.addEvent(new CheckListTitleUpdated(key, DateTime.now(), actor, this.getTaskId(), super.getID() as IdCheckList, { name: name.getName() }));
  }

  public addChecklistItem(title: Text, actor: IdEntity, key: string): void {
    const item = ChecklistItem.create(title);
    this.items = [...this.items, item];
    this.recalculateCompletedPercentage();
    this.addEvent(new ChecklistItemCreated(key, DateTime.now(), actor, this.getTaskId(), super.getID() as IdCheckList, item.toPrimitives()));
  }

  public deleteChecklistItem(itemId: string, actor: IdEntity, key: string): void {
    const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
    if (!item) throw new ResourceNotFound(`Checklist item ${itemId} not found`);
    this.items = this.items.filter((checklistItem) => checklistItem.getId().getID() !== itemId);
    this.recalculateCompletedPercentage();
    this.addEvent(new ChecklistItemDeleted(key, DateTime.now(), actor, this.getTaskId(), super.getID() as IdCheckList, item.toPrimitives()));
  }

  public completeChecklistItem(itemId: string, actor: IdEntity, key: string): void {
    this.updateChecklistItemStatus(itemId, true, actor, key, ChecklistItemCompleted);
  }

  public markChecklistItemAsPending(itemId: string, actor: IdEntity, key: string): void {
    this.updateChecklistItemStatus(itemId, false, actor, key, ChecklistItemMarkedAsPending);
  }

  public updateChecklistItemTitle(itemId: string, title: Text, actor: IdEntity, key: string): void {
    const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
    if (!item) throw new ResourceNotFound(`Checklist item ${itemId} not found`);
    const updatedItem = item.updateTitle(title);
    this.items = this.items.map((checklistItem) =>
      checklistItem.getId().getID() === itemId ? updatedItem : checklistItem,
    );
    this.addEvent(
      new ChecklistItemTitleUpdated(key, DateTime.now(), actor, this.getTaskId(), super.getID() as IdCheckList, {
        id: itemId,
        title: title.getText(),
      }),
    );
  }

  public delete(actor: IdEntity, key: string): void {
    this.addEvent(new CheckListDeleted(key, DateTime.now(), actor, this.getTaskId(), super.getID() as IdCheckList));
  }

  public toPrimitives(): CheckListParams {
    return {
      id: (super.getID() as IdCheckList).getID(),
      idOwner: this.getTaskId().getID(),
      name: this.name.getName(),
      items: this.items.map((item) => item.toPrimitives()),
      completedPercentage: this.completedPercentage.toPrimitive(),
    };
  }

  private updateChecklistItemStatus(
    itemId: string,
    isCompleted: boolean,
    actor: IdEntity,
    key: string,
    EventClass: typeof ChecklistItemCompleted | typeof ChecklistItemMarkedAsPending,
  ): void {
    const item = this.items.find((checklistItem) => checklistItem.getId().getID() === itemId);
    if (!item) throw new ResourceNotFound(`Checklist item ${itemId} not found`);

    const updatedItem = isCompleted ? item.complete() : item.markAsPending();
    this.items = this.items.map((checklistItem) =>
      checklistItem.getId().getID() === itemId ? updatedItem : checklistItem,
    );
    this.recalculateCompletedPercentage();
    this.addEvent(new EventClass(key, DateTime.now(), actor, this.getTaskId(), super.getID() as IdCheckList, updatedItem.toPrimitives()));
  }

  private recalculateCompletedPercentage(): void {
    if (this.items.length === 0) {
      this.completedPercentage = new PercentageCompleted(0);
      return;
    }

    const completedCount = this.items.filter((item) => item.isCompleted()).length;
    const percent = (completedCount / this.items.length) * 100;
    this.completedPercentage = new PercentageCompleted(percent);
  }
}
