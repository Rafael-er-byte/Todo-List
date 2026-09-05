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

    async createAccount(account: Account): Promise<void>{
        return await DbTryCatchWrapper<>
    }

    async updateAccount(account: Account): Promise<void> {
        
    }

    async deleteAccountById(id: IdEntity): Promise<void> {
        
    }

    async existsAccountOwnerByAccountIdAndProvider(sub: string, provider: string): Promise<boolean> {
        return await DbTryCatchWrapper<boolean>(async () => {
            const result = await this.db
            .select(
                {ownerId: Accounts.ownerId}
            )
            .from(Accounts)
            .where(and(eq(Accounts.subject, sub), eq(Accounts.provider, provider)));

            return result[0]!.ownerId !== undefined;
        });
    }
}
