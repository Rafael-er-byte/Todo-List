import ValueObject from '../../../shared/core/objects/ValueObject';
import Language from './Language';
import Theme from './Theme';
import Timezone from './Timezone';
import NotificationSettings from './NotificationSettings';
export default class UserSettings extends ValueObject {
    constructor(language, theme, timezone, notificationSettings) {
        super();
        this.language = language;
        this.theme = theme;
        this.timezone = timezone;
        this.notificationSettings = notificationSettings;
    }
    toPrimitives() {
        return {
            language: this.language.toPrimitives(),
            theme: this.theme.toPrimitives(),
            timezone: this.timezone.toPrimitives(),
            notificationSettings: this.notificationSettings.toPrimitives(),
        };
    }
    static fromPrimitives(params) {
        return new UserSettings(Language.create(params.language), Theme.create(params.theme), new Timezone(params.timezone), NotificationSettings.create(params.notificationSettings.type, params.notificationSettings.projectType, params.notificationSettings.channel, params.notificationSettings.active));
    }
}
//# sourceMappingURL=UserSettings.js.map