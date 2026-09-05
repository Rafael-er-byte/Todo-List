import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import type UserSettingsRepository from "../../core/repository/UserSettingsRepository";
import UserSettings from "../../core/model/UserSettings";
import { UsersSettings } from "../../../../../infrastructure/database/schema/UserSettings";
import type ConcreteTransaction from "../../../../../infrastructure/database/config/ConcreteTransaction";
import { DbTryCatchWrapper } from "../../../../../infrastructure/database/wrapper/DbTryCatchWrapper";
import ResourceNotFound from "../../../../shared/core/errors/ResourceNotFound";
import type UserSettingsParams from "../../core/interfaces/UserSettingsParams";
import type { AllowedLanguage } from "../../core/types/Language";
import type { AllowedTheme } from "../../core/types/Theme";

export default class ConcreteUserSettingsRepository implements UserSettingsRepository<ConcreteTransaction> {
    constructor(private db: NodePgDatabase) {}

    async createUserSettings(settings: UserSettings, tx?: ConcreteTransaction): Promise<void> {
        const db = tx?.getDb() ?? this.db;
        const data = settings.toPrimitives();

        return await DbTryCatchWrapper<void>(async () => {
            await db.insert(UsersSettings).values({
                id: data.id,
                userId: data.userId,
                lanuage: data.language,
                theme: data.theme,
                timezone: data.timezone,
                notificationSettings: data.notificationSettings,
            });
        });
    }

    async deleteUserSettingsById(id: string, tx?: ConcreteTransaction): Promise<void> {
        const db = tx?.getDb() ?? this.db;

        return await DbTryCatchWrapper<void>(async () => {
            await db.delete(UsersSettings)
                .where(eq(UsersSettings.id, id));
        });
    }

    async updateUserSettings(settings: UserSettings, tx?: ConcreteTransaction): Promise<void> {
        const db = tx?.getDb() ?? this.db;
        const data = settings.toPrimitives();

        return await DbTryCatchWrapper<void>(async () => {
            await db.update(UsersSettings)
                .set({
                    userId: data.userId,
                    lanuage: data.language,
                    theme: data.theme,
                    timezone: data.timezone,
                    notificationSettings: data.notificationSettings,
                })
                .where(eq(UsersSettings.id, data.id));
        });
    }

    async getUserSettingsById(id: string): Promise<UserSettings> {
        return await this.getSettings(() => this.db
            .select()
            .from(UsersSettings)
            .where(eq(UsersSettings.id, id)));
    }

    async getUserSettingsByUserId(userId: string): Promise<UserSettings> {
        return await this.getSettings(() => this.db
            .select()
            .from(UsersSettings)
            .where(eq(UsersSettings.userId, userId)));
    }

    private async getSettings(query: () => Promise<Array<typeof UsersSettings.$inferSelect>>): Promise<UserSettings> {
        return await DbTryCatchWrapper<UserSettings>(async () => {
            const [settings] = await query();

            if (!settings) throw new ResourceNotFound("User settings dont exist");

            const data: UserSettingsParams = {
                id: settings.id,
                userId: settings.userId,
                language: settings.lanuage as AllowedLanguage,
                theme: settings.theme as AllowedTheme,
                timezone: settings.timezone,
            };

            if (settings.notificationSettings !== null && settings.notificationSettings !== undefined) {
                data.notificationSettings = settings.notificationSettings as NonNullable<UserSettingsParams["notificationSettings"]>;
            }

            return new UserSettings(data);
        });
    }
}
