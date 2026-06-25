import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedTheme } from '../types/Theme';
export default class Theme extends ValueObject {
    private theme;
    private constructor();
    static create(theme: AllowedTheme): Theme;
    static dark(): Theme;
    static light(): Theme;
    getTheme(): AllowedTheme;
    toPrimitives(): AllowedTheme;
}
//# sourceMappingURL=Theme.d.ts.map