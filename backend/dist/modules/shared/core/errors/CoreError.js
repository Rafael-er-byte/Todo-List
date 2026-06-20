export default class CoreError extends Error {
    constructor(message, info) {
        super(message);
        this.info = info;
        Object.setPrototypeOf(this, new.target.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, new.target);
        }
    }
}
//# sourceMappingURL=CoreError.js.map