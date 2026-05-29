import CoreError from '../../../shared/core/errors/CoreError';
export default class CannotDeleteIndividuallyTaskArchivedByOtherEntity extends CoreError {
    constructor(info) {
        super('Cannot delete individually a task that is archived by other entity', info);
        Object.setPrototypeOf(this, CannotDeleteIndividuallyTaskArchivedByOtherEntity.prototype);
    }
}
//# sourceMappingURL=CannotDeleteIndividuallyTaskArchivedByOtherEntity.js.map