import ValueObject from '../../../../shared/core/objects/ValueObject';
import UnsupportedTheme from '../errors/UnsupportedTheme';
import { ALLOWED_THEMES, AllowedTheme } from '../types/Theme';
export default class Theme extends ValueObject {
    constructor(theme) {
        super();
        if (!ALLOWED_THEMES.includes(theme))
            throw new UnsupportedTheme(theme);
        this.theme = theme;
    }
    getTheme() {
        return this.theme;
    }
}
//# sourceMappingURL=Theme.js.map