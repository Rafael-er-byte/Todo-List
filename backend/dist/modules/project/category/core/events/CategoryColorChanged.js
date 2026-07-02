import DomainEvent from '../../../../shared/core/events/DomainEvent';
export default class CategoryColorChanged extends DomainEvent {
    constructor(key, date, actor, idProject, idEntity, newColor) {
        super(key, date, actor, idProject, idEntity, 'CATEGORY_COLOR_CHANGED', newColor);
    }
}
//# sourceMappingURL=CategoryColorChanged.js.map