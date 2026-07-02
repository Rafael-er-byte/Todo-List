import CoreError from '../../../../shared/core/errors/CoreError';
export default class BackgroundTypeNotSupported extends CoreError {
    constructor(backgroundType) {
        super('Project background type is not supported', { backgroundType });
        Object.setPrototypeOf(this, BackgroundTypeNotSupported.prototype);
    }
}
//# sourceMappingURL=BackgroundTypeNotSupported.js.map