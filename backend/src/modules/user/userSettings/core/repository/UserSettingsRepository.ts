import type UserSettings from "../model/UserSettings";

export default interface UserSetingsRepository<TX>{
    createUserSettings(settings: UserSettings, tx?: TX): Promise<void>
    deleteUserSettingsById(id: string, tx?: TX): Promise<void>
    updateUserSettings(settings: UserSettings, tx?: TX): Promise<void>
    getUserSettingsById(id: string): Promise<UserSettings>
    getUserSettingsByUserId(userId: string): Promise<UserSettings>
}
