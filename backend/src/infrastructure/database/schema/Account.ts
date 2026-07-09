import { boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";
import { User } from "./User";

export const Account = pgTable("Account", {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    provider: text("provider").notNull(),
    username: text("username").notNull(),
    urlImageProfile: text("urlImageProfile"),
    subject: text("sub").notNull(),
    isPrimary: boolean("isPrimary").default(false),
    ownerId: uuid("ownerId").notNull().references(() => User.id, {
        onDelete: "cascade"
    })
});
