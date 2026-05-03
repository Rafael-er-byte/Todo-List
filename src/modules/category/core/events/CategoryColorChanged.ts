import type Member from '../../../member/core/model/Member';
import DomainEvent from '../../../shared/core/events/DomainEvent';
import type DateTime from '../../../shared/core/objects/DateTime';
import type IdEntity from '../../../shared/core/objects/IdEntity';
import type CategoryColor from '../objects/CategoryColor';
import ID from '../../../shared/core/objects/ID';
import ProjectInfo from '../../../shared/core/events/ProjectInfo';

export default class CategoryColorChanged extends DomainEvent {
  constructor(
    date: DateTime,
    modifier: Member,
    idProject: IdEntity,
    idEntity: IdEntity,
    newColor: CategoryColor,
    projectName: string,
  ) {
    const actor = {
      name: modifier.toPrimitives().memberInfo.getUserName(),
      id: modifier.getId(),
    };
    const projectInfo = new ProjectInfo(idProject.getID(), projectName);
    super(ID.generateId(), date, actor, projectInfo, idEntity, 'CATEGORY_COLOR_CHANGED', newColor);
  }
}
