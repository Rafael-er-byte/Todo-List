import LimitExceeded from '../../../shared/core/errors/LimitExceeded';
import Text from '../../../shared/core/objects/Text';
import ValueObject from '../../../shared/core/objects/ValueObject';
import CategoryLimits from '../constants/CategoryLimits';
import CategoryNameMustBeAValidText from '../error/CategoryNameMustBeAValidText';
export default class CategoryName extends ValueObject {
    constructor(name) {
        super();
        try {
            this.name = new Text(name);
            if (this.name.size() > CategoryLimits.MAX_NAME_LENGTH)
                throw new LimitExceeded(name);
        }
        catch (error) {
            if (error instanceof LimitExceeded)
                throw error;
            throw new CategoryNameMustBeAValidText(name);
        }
    }
    getName() {
        return this.name.getText();
    }
}
//# sourceMappingURL=CategoryName.js.map