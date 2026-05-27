import LimitExceeded from "../../../shared/core/errors/LimitExceeded";
import ListRules from "../constants/ListRules";
export default class ListTitle {
    constructor(value) {
        if (value.size() > ListRules.TITLE_LIMIT_SIZE) {
            throw new LimitExceeded(`List title cannot be longer than ${ListRules.TITLE_LIMIT_SIZE} characters`);
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
//# sourceMappingURL=ListTitle.js.map