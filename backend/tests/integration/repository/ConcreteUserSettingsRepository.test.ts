import { beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { StartDbContainer } from "../helper/StartDBContainer";
import { Environment } from "../../../src/infrastructure/environment/Environment";
import buildDb from "../../../src/infrastructure/database/config/Db";
import { Users } from "../../../src/infrastructure/database/schema/User";
import { UsersSettings } from "../../../src/infrastructure/database/schema/UserSettings";
import ConcreteUserSettingsRepository from "../../../src/modules/user/userSettings/infrastructure/repository/ConcreteUserSettingsRepository";
import UserSettings from "../../../src/modules/user/userSettings/core/model/UserSettings";
import ConcreteTransaction from "../../../src/infrastructure/database/config/ConcreteTransaction";
import { DEFAULT_ID } from "../../constants/DefaultConstants";
import { AllowedLanguage } from "../../../src/modules/user/userSettings/core/types/Language";
import { AllowedTheme } from "../../../src/modules/user/userSettings/core/types/Theme";
import { AllowedChannelType, AllowedNotificationType, AllowedProjectType } from "../../../src/modules/user/userSettings/core/types/NotificationSettings";

describe("ConcreteUserSettingsRepository tests", () => {
    let db: NodePgDatabase;
    let repo: ConcreteUserSettingsRepository;
    let tx: ConcreteTransaction;
    const settingsId = "1143c815-7220-7d64-8c42-6f2af4f9fd37";

    beforeAll(async () => {
        const { dburi } = await StartDbContainer();
        Environment.dbUrl = dburi;
        db = await buildDb();
        await migrate(db, {
            migrationsFolder: path.resolve(__dirname, "../../../src/infrastructure/database/drizzle"),
        });
        await db.insert(Users).values({ id: DEFAULT_ID, name: "Jhon Doe" });
        repo = new ConcreteUserSettingsRepository(db);
        tx = new ConcreteTransaction(db);
    }, 70000);

    it("Should create and retrieve settings by ID and user ID", async () => {
        const settings = new UserSettings({
            id: settingsId,
            userId: DEFAULT_ID,
            language: AllowedLanguage.en,
            theme: AllowedTheme.light,
            timezone: "America/Mexico_City",
            notificationSettings: {
                type: AllowedNotificationType.assigned,
                projectType: AllowedProjectType.all,
                channel: AllowedChannelType.push,
                active: true,
            },
        });

        await repo.createUserSettings(settings, tx);

        expect((await repo.getUserSettingsById(settingsId)).toPrimitives()).toEqual(settings.toPrimitives());
        expect((await repo.getUserSettingsByUserId(DEFAULT_ID)).toPrimitives()).toEqual(settings.toPrimitives());
    });

    it("Should update settings", async () => {
        const settings = new UserSettings({
            id: settingsId,
            userId: DEFAULT_ID,
            language: AllowedLanguage.es,
            theme: AllowedTheme.dark,
            timezone: "Europe/Madrid",
            notificationSettings: {
                type: AllowedNotificationType.mentions,
                projectType: AllowedProjectType.favorite,
                channel: AllowedChannelType.email,
                active: false,
            },
        });

        await repo.updateUserSettings(settings, tx);

        expect((await repo.getUserSettingsById(settingsId)).toPrimitives()).toEqual(settings.toPrimitives());
    });

    it("Should delete settings and throw when retrieving missing settings", async () => {
        await repo.deleteUserSettingsById(settingsId, tx);

        await expect(repo.getUserSettingsById(settingsId))
            .rejects.toThrow("User settings dont exist");
    });

    it("Should throw when the user has no settings", async () => {
        await expect(repo.getUserSettingsByUserId(DEFAULT_ID))
            .rejects.toThrow("User settings dont exist");
    });
});
