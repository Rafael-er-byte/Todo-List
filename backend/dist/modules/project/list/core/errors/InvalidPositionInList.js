import CoreError from '../../../../shared/core/errors/CoreError';
export default class InvalidPositionInList extends CoreError {
    constructor(info) {
        super('Invalid position to insert a task', info);
        Object.setPrototypeOf(this, InvalidPositionInList.prototype);
    }
}
//# sourceMappingURL=InvalidPositionInList.js.map