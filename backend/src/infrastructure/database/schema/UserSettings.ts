import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { User } from "./User";

export const UserSettings = pgTable("UserSettings", {
    id: uuid("id").primaryKey(),
    theme: text("theme").notNull(),
    lanuage: text("lang").notNull(),
    timezone: text("timezone").notNull(),
    notificationSettings: jsonb("notificationSettings"),
    userId: uuid("userId").notNull().references(() => User.id, {
        onDelete: "cascade"
    })
});
