import { describe, it, expect, beforeAll } from "vitest";
import { StartDbContainer } from "../helper/StartDBContainer";
import { Environment } from "../../../src/infrastructure/environment/Environment";
import {migrate} from 'drizzle-orm/node-postgres/migrator';
import buildDb from '../../../src/infrastructure/database/config/Db';
import path from "node:path";
import UserRepository from "../../../src/modules/user/user/core/repository/UserRepository";
import ConcreteUserRepository from '../../../src/modules/user/user/infrastructure/repository/ConcreteUserRepository'
import User from "../../../src/modules/user/user/core/model/User";
import { DEFAULT_ID } from "../../constants/DefaultConstants";
import { Transaction } from "../../../src/modules/shared/core/transaction/Transaction";
import ConcreteTransaction from "../../../src/infrastructure/database/config/ConcreteTransaction";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

describe('ConcreteUserRepository tests', () => {
    let container;
    let dburi;
    let db: NodePgDatabase;
    let tx: Transaction<NodePgDatabase>;
    let repo: UserRepository;

    beforeAll(async () => {
        ({dburi, container} = await StartDbContainer());
        Environment.dbUrl = dburi;
        db = await buildDb();
        await migrate(db, {migrationsFolder: path.resolve(__dirname, '../../../src/infrastructure/database/drizzle')});
        repo = new ConcreteUserRepository(db);
        tx = new ConcreteTransaction(db);
    }, 60000);

    it('Should insert an user into databaase and retrive it', async () => {
        const user = User.fromPrimitives({
            id: DEFAULT_ID,
            accounts: []
        });

        await repo.createUser(user, tx);

        const result = await db.query(
            
        );
    });

});
