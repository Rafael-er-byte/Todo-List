import Entity from '../../../shared/core/model/Entity';
import IdEntity from '../../../shared/core/objects/IdEntity';
import Language from '../objects/Language';
import Theme from '../objects/Theme';
import Timezone from '../objects/Timezone';
import NotificationSettings from '../objects/NotificationSettings';
import InvalidUserSettingsKey from '../errors/InvalidUserSettingsKey';
import InvalidUserSettingsValue from '../errors/InvalidUserSettingsValue';
export default class UserSettings extends Entity {
    constructor(id, userId, language, theme, timezone, notificationSettings) {
        super(id);
        this.userId = userId;
        this.language = language;
        this.theme = theme;
        this.timezone = timezone;
        this.notificationSettings = notificationSettings;
    }
    static create(params) {
        return new UserSettings(new IdEntity(params.id), new IdEntity(params.userId), Language.create(params.language), Theme.create(params.theme), new Timezone(params.timezone), NotificationSettings.create(params.notificationSettings.type, params.notificationSettings.projectType, params.notificationSettings.channel, params.notificationSettings.active));
    }
    static fromPrimitives(params) {
        return UserSettings.create(params);
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
        if (!(language instanceof Language))
            throw new InvalidUserSettingsValue('language');
        this.language = language;
    }
    updateTheme(theme) {
        if (!(theme instanceof Theme))
            throw new InvalidUserSettingsValue('theme');
        this.theme = theme;
    }
    updateTimezone(timezone) {
        if (!(timezone instanceof Timezone))
            throw new InvalidUserSettingsValue('timezone');
        this.timezone = timezone;
    }
    updateNotificationSettings(notificationSettings) {
        if (!(notificationSettings instanceof NotificationSettings))
            throw new InvalidUserSettingsValue('notificationSettings');
        this.notificationSettings = notificationSettings;
    }
    updateSetting(key, value) {
        switch (key) {
            case 'language':
                if (!(value instanceof Language))
                    throw new InvalidUserSettingsValue('language');
                this.updateLanguage(value);
                return;
            case 'theme':
                if (!(value instanceof Theme))
                    throw new InvalidUserSettingsValue('theme');
                this.updateTheme(value);
                return;
            case 'timezone':
                if (!(value instanceof Timezone))
                    throw new InvalidUserSettingsValue('timezone');
                this.updateTimezone(value);
                return;
            case 'notificationSettings':
                if (!(value instanceof NotificationSettings))
                    throw new InvalidUserSettingsValue('notificationSettings');
                this.updateNotificationSettings(value);
                return;
            default:
                throw new InvalidUserSettingsKey(String(key));
        }
    }
    toPrimitives() {
        return {
            id: this.getID().getID(),
            userId: this.userId.getID(),
            language: this.language.toPrimitives(),
            theme: this.theme.toPrimitives(),
            timezone: this.timezone.toPrimitives(),
            notificationSettings: this.notificationSettings.toPrimitives(),
        };
    }
}
//# sourceMappingURL=UserSettings.js.map