import Entity from '../../../../shared/core/model/Entity';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import Language from '../objects/Language';
import Theme from '../objects/Theme';
import Timezone from '../objects/Timezone';
import NotificationSettings from '../objects/NotificationSettings';
export default class UserSettings extends Entity {
    constructor(params) {
        super(new IdEntity(params.id));
        this.userId = new IdEntity(params.userId);
        this.language = new Language(params.language);
        this.theme = new Theme(params.theme);
        this.timezone = new Timezone(params.timezone);
        this.notificationSettings = NotificationSettings.create(params.notificationSettings.type, params.notificationSettings.projectType, params.notificationSettings.channel, params.notificationSettings.active);
    }
    getUserId() {
        return this.userId;
    }
    getLanguage() {
        return this.language;
    }
    getTheme() {
        return this.theme;
    }
    getTimezone() {
        return this.timezone;
    }
    getNotificationSettings() {
        return this.notificationSettings;
    }
    updateLanguage(language) {
        this.language = language;
    }
    updateTheme(theme) {
        this.theme = theme;
    }
    updateTimezone(timezone) {
        this.timezone = timezone;
    }
    updateNotificationSettings(notificationSettings) {
        this.notificationSettings = notificationSettings;
    }
    toPrimitives() {
        return {
            id: this.getID().getID(),
            userId: this.userId.getID(),
            language: this.language.getLanguage(),
            theme: this.theme.getTheme(),
            timezone: this.timezone.getTimezone(),
            notificationSettings: this.notificationSettings.toPrimitives(),
        };
    }
}
//# sourceMappingURL=UserSettings.js.map