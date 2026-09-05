import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type AccountRepository from "../../core/repository/AccountRespository";
import Account from "../../core/model/Account";
import { DbTryCatchWrapper } from "../../../../../infrastructure/database/wrapper/DbTryCatchWrapper";
import { Accounts } from "../../../../../infrastructure/database/schema/Account";
import {and, eq} from 'drizzle-orm'
import type ConcreteTransaction from "../../../../../infrastructure/database/config/ConcreteTransaction";
import type IdEntity from "../../../../shared/core/objects/IdEntity";

export default class ConcreteAccountRepository implements AccountRepository<ConcreteTransaction>{
    constructor(private db: NodePgDatabase){}

    async createAccount(account: Account, tx?: ConcreteTransaction): Promise<void>{
        const db = tx?.getDb() ?? this.db;
        const accountData = account.toPrimitives();

        return await DbTryCatchWrapper<void>(async () => {
            await db.insert(Accounts).values({
                id: accountData.id,
                email: accountData.email,
                provider: accountData.provider,
                username: accountData.name,
                urlImageProfile: accountData.profileImage,
                subject: accountData.sub,
                isPrimary: accountData.isPrimary,
                ownerId: accountData.userId,
            });
        });
    }

    async updateAccount(account: Account): Promise<void> {
        const accountData = account.toPrimitives();

        return await DbTryCatchWrapper<void>(async () => {
            await this.db.update(Accounts)
                .set({
                    email: accountData.email,
                    provider: accountData.provider,
                    username: accountData.name,
                    urlImageProfile: accountData.profileImage,
                    subject: accountData.sub,
                    isPrimary: accountData.isPrimary,
                    ownerId: accountData.userId,
                })
                .where(eq(Accounts.id, accountData.id));
        });
    }

    async deleteAccountById(id: IdEntity): Promise<void> {
        return await DbTryCatchWrapper<void>(async () => {
            await this.db.delete(Accounts)
                .where(eq(Accounts.id, id.toString()));
        });
    }

    async existsAccountOwnerByAccountIdAndProvider(accountId: string, provider: string, tx?: ConcreteTransaction): Promise<boolean> {
        const db = tx?.getDb() ?? this.db;

        return await DbTryCatchWrapper<boolean>(async () => {
            const result = await db
                .select({ ownerId: Accounts.ownerId })
                .from(Accounts)
                .where(and(eq(Accounts.subject, accountId), eq(Accounts.provider, provider)));

            return result.length > 0;
        });
    }
}
