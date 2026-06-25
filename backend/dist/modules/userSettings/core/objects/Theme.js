import ValueObject from '../../../shared/core/objects/ValueObject';
import UnsupportedTheme from '../errors/UnsupportedTheme';
import { ALLOWED_THEMES, AllowedTheme } from '../types/Theme';
export default class Theme extends ValueObject {
    constructor(theme) {
        super();
        if (!ALLOWED_THEMES.includes(theme))
            throw new UnsupportedTheme(theme);
        this.theme = theme;
    }
    static create(theme) {
        return new Theme(theme);
    }
    static dark() {
        return new Theme(AllowedTheme.dark);
    }
    static light() {
        return new Theme(AllowedTheme.light);
    }
    getTheme() {
        return this.theme;
    }
    toPrimitives() {
        return this.theme;
    }
}
//# sourceMappingURL=Theme.js.map