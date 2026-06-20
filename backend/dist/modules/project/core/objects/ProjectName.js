import LimitExceeded from '../../../shared/core/errors/LimitExceeded';
import Text from '../../../shared/core/objects/Text';
import ValueObject from '../../../shared/core/objects/ValueObject';
const MAX_PROJECT_NAME_LENGTH = 1000;
export default class ProjectName extends ValueObject {
    constructor(name) {
        super();
        this.name = new Text(name);
        if (this.name.size() > MAX_PROJECT_NAME_LENGTH) {
            throw new LimitExceeded(`Project name cannot be longer than ${MAX_PROJECT_NAME_LENGTH} characters`);
        }
    }
    getName() {
        return this.name.getText();
    }
}
//# sourceMappingURL=ProjectName.js.map