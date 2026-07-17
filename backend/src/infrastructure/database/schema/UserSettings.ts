import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { Users} from "./User";

export const UsersSettings = pgTable("UserSettings", {
    id: uuid("id").primaryKey(),
    theme: text("theme").notNull(),
    lanuage: text("lang").notNull(),
    timezone: text("timezone").notNull(),
    notificationSettings: jsonb("notificationSettings"),
    userId: uuid("userId").notNull().references(() => Users.id, {
        onDelete: "cascade"
    })
});
