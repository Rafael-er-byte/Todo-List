import {beforeAll, describe, expect, it} from "vitest"
import { StartDbContainer } from "../helper/StartDBContainer";
import { Environment } from "../../../src/infrastructure/environment/Environment";
import DbBuilder from "../../../src/infrastructure/database/config/Db"

describe("Db connection test", () => {

    let container;
    let dburi;

    beforeAll(async () => {
        ({dburi, container} = await StartDbContainer());
        Environment.dbUrl = dburi
    }, 60000);

    it("Shoud execute valid requests to a database", async () => {
        const db = await DbBuilder();

        const result = await db.execute("SELECT 1 AS result");
        console.log(result.rows[0].result);
        expect(result.rows[0].result).toBe(1);
    });
});
