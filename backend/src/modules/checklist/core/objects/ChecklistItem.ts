import ID from '../../../shared/core/objects/ID';
import Text from '../../../shared/core/objects/Text';
import ValueObject from '../../../shared/core/objects/ValueObject';
import type ChecklistItemParams from '../interfaces/ChecklistItemParams';
import ChecklistItemId from './ChecklistItemId';

export default class ChecklistItem extends ValueObject {
  private id!: ChecklistItemId;
  private title!: Text;
  private completed!: boolean;

  private constructor(id: ChecklistItemId, title: Text, completed: boolean) {
    super();
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  public static create(title: Text): ChecklistItem {
    const itemId = new ChecklistItemId(ID.generateId().toString());
    return new ChecklistItem(itemId, title, false);
  }

  public static fromPrimitives(params: ChecklistItemParams): ChecklistItem {
    return new ChecklistItem(
      new ChecklistItemId(params.id),
      new Text(params.title),
      params.isCompleted,
    );
  }

  public getId(): ChecklistItemId {
    return this.id;
  }

  public getTitle(): Text {
    return this.title;
  }

  public getStatus(): boolean {
    return this.completed;
  }

  public complete(): ChecklistItem {
    return new ChecklistItem(this.id, this.title, true);
  }

  public markAsPending(): ChecklistItem {
    return new ChecklistItem(this.id, this.title, false);
  }

  public updateTitle(title: Text): ChecklistItem {
    return new ChecklistItem(this.id, title, this.completed);
  }

  public isCompleted(): boolean {
    return this.completed;
  }

  public toPrimitives(): ChecklistItemParams {
    return {
      id: this.id.getID(),
      title: this.title.getText(),
      isCompleted: this.completed,
    };
  }
}
