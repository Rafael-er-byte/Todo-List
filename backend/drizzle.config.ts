import { defineConfig } from "drizzle-kit";
import {Environment} from "./src/infrastructure/environment/Environment"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/database/schema/*.ts",
  out: "./src/infrastructure/database/drizzle",
  dbCredentials: {
    url: Environment.dbUrl!,
  },
});
