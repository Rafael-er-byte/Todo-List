import ValueObject from '../../../shared/core/objects/ValueObject';
import { AllowedTheme } from '../types/Theme';
export default class Theme extends ValueObject {
    private theme;
    constructor(theme: AllowedTheme);
    getTheme(): AllowedTheme;
}
//# sourceMappingURL=Theme.d.ts.map