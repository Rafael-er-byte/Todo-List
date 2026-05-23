import InvalidParameters from '../errors/InvalidParameters';
import ValueObject from './ValueObject';
export default class Text extends ValueObject {
    constructor(text) {
        super();
        if (!text || typeof text !== 'string' || text.trim().length === 0)
            throw new InvalidParameters('Must be text');
        this.text = text;
    }
    getText() {
        return this.text;
    }
    size() {
        return this.text.length;
    }
}
//# sourceMappingURL=Text.js.map