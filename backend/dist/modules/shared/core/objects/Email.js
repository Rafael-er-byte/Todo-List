import ValueObject from '../../../shared/core/objects/ValueObject';
import InvalidFormat from '../errors/InvalidFormat';
export default class Email extends ValueObject {
    constructor(email) {
        super();
        if (!Email.isValidEmail(email)) {
            throw new InvalidFormat('Invalid email format');
        }
        this.value = email.toLowerCase();
    }
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return typeof email === 'string' && re.test(email);
    }
    toString() {
        return this.value;
    }
    getEmail() {
        return this.value;
    }
}
//# sourceMappingURL=Email.js.map