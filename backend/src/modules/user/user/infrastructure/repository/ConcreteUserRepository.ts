import type User from "../../core/model/User";
import {Users} from "../../../../../infrastructure/database/schema/User"
import type UserRepository from "../../core/repository/UserRepository";
import type ConcreteTransaction from "../../../../../infrastructure/database/config/ConcreteTransaction";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Accounts } from "../../../../../infrastructure/database/schema/Account";
import { and, eq } from "drizzle-orm";
import { DbTryCatchWrapper } from "../../../../../infrastructure/database/wrapper/DbTryCatchWrapper";
import type IdEntity from "../../../../shared/core/objects/IdEntity";

export default class ConcreteUserRepository implements UserRepository{
    constructor(private db: NodePgDatabase){}
    
    async createUser(user: User, tx: ConcreteTransaction): Promise<void> {
        const db = tx.getDb();
        
        return await DbTryCatchWrapper<void>(async () => {
            await db.insert(Users).values({
            id: user.getId().toString()});
            }
        );
    }

    async existsUserByAccountIdAndProvider(sub: string, provider: string): Promise<boolean> {
        return await DbTryCatchWrapper<boolean>(async () => {
            const result = await this.db
            .select(
                {id: Users.id}
            )
            .from(Users)
            .leftJoin(Accounts, 
                and(
                    eq(Accounts.subject, sub), 
                    eq(Accounts.provider, provider)
                )
            );

            return result[0]!.id !== undefined;
        });
    }

    async getUserById(id: IdEntity): Promise<User>{
        return await DbTryCatchWrapper<User>(async () => {
            const result await this.db.select({id: Users.id}).from(Users).where(eq(Users.id, id.toString()));
        });
    }
}
