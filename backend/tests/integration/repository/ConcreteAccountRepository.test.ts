import { beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { StartDbContainer } from "../helper/StartDBContainer";
import { Environment } from "../../../src/infrastructure/environment/Environment";
import buildDb from "../../../src/infrastructure/database/config/Db";
import { Users } from "../../../src/infrastructure/database/schema/User";
import { Accounts } from "../../../src/infrastructure/database/schema/Account";
import ConcreteAccountRepository from "../../../src/modules/user/account/infrastructure/repository/ConcreteAccountRepository";
import Account from "../../../src/modules/user/account/core/model/Account";
import ConcreteTransaction from "../../../src/infrastructure/database/config/ConcreteTransaction";
import { DEFAULT_ID } from "../../constants/DefaultConstants";
import IdEntity from "../../../src/modules/shared/core/objects/IdEntity";

describe("ConcreteAccountRepository tests", () => {
    let db: NodePgDatabase;
    let repo: ConcreteAccountRepository;
    let tx: ConcreteTransaction;

    beforeAll(async () => {
        const { dburi } = await StartDbContainer();
        Environment.dbUrl = dburi;
        db = await buildDb();
        await migrate(db, {
            migrationsFolder: path.resolve(__dirname, "../../../src/infrastructure/database/drizzle"),
        });
        await db.insert(Users).values({ id: DEFAULT_ID, name: "Jhon Doe" });
        repo = new ConcreteAccountRepository(db);
        tx = new ConcreteTransaction(db);
    }, 70000);

    it("Should create an account and detect it by provider and subject", async () => {
        const account = Account.create({
            userId: DEFAULT_ID,
            email: "account@example.com",
            name: "Account",
            sub: "provider|account-1",
            provider: "google",
            profileImage: "https://example.com/account.png",
            isPrimary: true,
        });

        await repo.createAccount(account, tx);

        expect(await repo.existsAccountOwnerByAccountIdAndProvider("provider|account-1", "google", tx)).toBe(true);
        expect(await repo.existsAccountOwnerByAccountIdAndProvider("missing", "google")).toBe(false);
    });

    it("Should update an account", async () => {
        const [stored] = await db.select().from(Accounts);
        const account = Account.fromPrimitives({
            id: stored!.id,
            email: "updated@example.com",
            name: "Updated Account",
            sub: "provider|account-1",
            provider: "github",
            profileImage: null,
            userId: DEFAULT_ID,
            isPrimary: false,
            createdAt: new Date(),
        });

        await repo.updateAccount(account);

        const [updated] = await db.select().from(Accounts);
        expect(updated).toMatchObject({
            id: stored!.id,
            email: "updated@example.com",
            username: "Updated Account",
            provider: "github",
            urlImageProfile: null,
            isPrimary: false,
        });
    });

    it("Should delete an account", async () => {
        const [stored] = await db.select().from(Accounts);

        await repo.deleteAccountById(new IdEntity(stored!.id));

        expect(await db.select().from(Accounts)).toHaveLength(0);
    });
});
