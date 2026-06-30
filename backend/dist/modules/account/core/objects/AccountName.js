import ValueObject from '../../../shared/core/objects/ValueObject';
import Text from '../../../shared/core/objects/Text';
export default class AccountName extends ValueObject {
    constructor(name) {
        super();
        this.name = new Text(name);
    }
    getName() {
        return this.name.getText();
    }
    toPrimitives() {
        return this.name.getText();
    }
}
//# sourceMappingURL=AccountName.js.map