import LimitExceeded from '../../../../shared/core/errors/LimitExceeded';
import Text from '../../../../shared/core/objects/Text';
import ValueObject from '../../../../shared/core/objects/ValueObject';
import TaskBusinessRules from '../constants/TaskRules';
export default class TaskTitle extends ValueObject {
    constructor(title) {
        super();
        const textTitle = new Text(title);
        if (textTitle.size() > TaskBusinessRules.TITLE_LIMIT_SIZE)
            throw new LimitExceeded('Title size limit exceeded');
        this.title = textTitle;
    }
    getTitle() {
        return this.title.getText();
    }
}
//# sourceMappingURL=TaskTitle.js.map