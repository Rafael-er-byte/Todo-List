import type IdEntity from '../../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../shared/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
import type IdCheckList from '../objects/IdCheckList';

export default class ChecklistItemTitleUpdated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    ownerId: IdEntity,
    idCheckList: IdCheckList,
    info: unknown,
  ) {
    super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_ITEM_TITLE_UPDATED', info);
  }
}
