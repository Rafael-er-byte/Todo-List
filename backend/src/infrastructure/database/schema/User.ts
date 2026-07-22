import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    urlImage: text("urlImage"),
    createdAt: timestamp("createdAt").defaultNow()
});
