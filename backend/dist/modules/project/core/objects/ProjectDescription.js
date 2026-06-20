import Text from '../../../shared/core/objects/Text';
import ValueObject from '../../../shared/core/objects/ValueObject';
export default class ProjectDescription extends ValueObject {
    constructor(description) {
        super();
        this.description = new Text(description);
    }
    getDescription() {
        return this.description.getText();
    }
}
//# sourceMappingURL=ProjectDescription.js.map