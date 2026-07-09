import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Environment } from "../../environment/Environment";

export default function DbBuilder(){
    const pool = new Pool({
        connectionString: Environment.dbUrl,
    });

    return drizzle(pool);
}
