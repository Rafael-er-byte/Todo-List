import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Environment } from "../../environment/Environment";

export default function buildDb(){
    const pool = new Pool({
        connectionString: Environment.dbUrl,
    });

    return drizzle(pool);
}
