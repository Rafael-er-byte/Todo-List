import LimitExceeded from '../../../../shared/core/errors/LimitExceeded';
import Text from '../../../../shared/core/objects/Text';
import ValueObject from '../../../../shared/core/objects/ValueObject';
const MAX_CHECKLIST_NAME_LENGTH = 1000;
export default class CheckListName extends ValueObject {
    constructor(name) {
        super();
        const text = new Text(name);
        if (text.size() > MAX_CHECKLIST_NAME_LENGTH) {
            throw new LimitExceeded(`Checklist name cannot be longer than ${MAX_CHECKLIST_NAME_LENGTH} characters`);
        }
        this.name = text;
    }
    getName() {
        return this.name.getText();
    }
}
//# sourceMappingURL=CheckListName.js.map