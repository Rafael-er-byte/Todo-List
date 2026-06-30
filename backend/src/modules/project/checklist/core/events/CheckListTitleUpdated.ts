import type IdEntity from '../../../../shared/core/objects/IdEntity';
import DomainEvent from '../../../../shared/core/events/DomainEvent';
import DateTime from '../../../../shared/core/objects/DateTime';
import type IdCheckList from '../objects/IdCheckList';

export default class CheckListTitleUpdated extends DomainEvent {
  constructor(
    key: string,
    date: DateTime,
    actor: IdEntity,
    ownerId: IdEntity,
    idCheckList: IdCheckList,
    info: unknown,
  ) {
    super(key, date, actor, ownerId, idCheckList, 'CHECKLIST_TITLE_UPDATED', info);
  }
}
