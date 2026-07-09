import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const User = pgTable("User", {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("createdAt").notNull().defaultNow()
});
