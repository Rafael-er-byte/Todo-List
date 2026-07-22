import { boolean, index, pgTable, text, uuid} from "drizzle-orm/pg-core";
import { Users } from "./User";

export const Accounts = pgTable("accounts", {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    provider: text("provider").notNull(),
    username: text("username").notNull(),
    urlImageProfile: text("urlImageProfile"),
    subject: text("sub").notNull(),
    isPrimary: boolean("isPrimary").default(false).notNull(),
    ownerId: uuid("ownerId").notNull().references(() => Users.id, {
        onDelete: "cascade"
    })
},  
    (table) => ([ 
        index("provider_subject_idx").on(table.subject, table.provider)
]));
