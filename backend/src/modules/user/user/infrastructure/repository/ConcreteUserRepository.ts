import User from "../../core/model/User";
import {Users} from "../../../../../infrastructure/database/schema/User"
import type UserRepository from "../../core/repository/UserRepository";
import type ConcreteTransaction from "../../../../../infrastructure/database/config/ConcreteTransaction";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Accounts } from "../../../../../infrastructure/database/schema/Account";
import { and, eq } from "drizzle-orm";
import { DbTryCatchWrapper } from "../../../../../infrastructure/database/wrapper/DbTryCatchWrapper";
import IdEntity from "../../../../shared/core/objects/IdEntity";
import ResourceNotFound from "../../../../shared/core/errors/ResourceNotFound";
import Url from "../../../../shared/core/objects/URL";

export default class ConcreteUserRepository implements UserRepository<ConcreteTransaction> {
    constructor(private db: NodePgDatabase){}
    
    async createUser(user: User, tx: ConcreteTransaction): Promise<void> {
        const db = tx.getDb();
        
        return await DbTryCatchWrapper<void>(async () => {
            await db.insert(Users).values({
                    id: user.getId().toString(),
                    name: user.getName().toString(),
                    urlImage: user.getProfileUrl() instanceof Url? (user.getProfileUrl() as Url).getUrl(): null 
            });
        });
    }

    async updateUser(user: User): Promise<void> {
            return await DbTryCatchWrapper<void>(async () => {
                await this.db.update(Users)
                    .set({
                    name: user.getName().toString(),
                    urlImage: user.getProfileUrl() instanceof Url? (user.getProfileUrl() as Url).getUrl(): null 
                })
                .where(eq(Users.id, user.getId().toString()));
        });
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

    async getUserById(id: IdEntity, withAccounts: boolean = false): Promise<User>{
        return await DbTryCatchWrapper<User>(async () => {
          const userPromise: Promise<{
                                id: string, 
                                name: string, 
                                urlImage: string | null
                            }[]> = Promise.resolve(this.db
                                .select({
                                    id: Users.id,
                                    name: Users.name,
                                    urlImage: Users.urlImage,
                                })
                                .from(Users)
                                .where(eq(Users.id, id.toString())));

            const accountsPromise: Promise<[string, boolean][] | null> = withAccounts
                                ? Promise.resolve(this.db
                                    .select({
                                        id: Accounts.id,
                                        isPrimary: Accounts.isPrimary,
                                    })
                                    .from(Accounts)
                                    .where(eq(Accounts.ownerId, id.toString()))
                                    .then(result => result.map(a => [a.id, a.isPrimary] as [string, boolean])))
                                : Promise.resolve(null);

            const [user, accounts] = await Promise.all([
                userPromise,
                accountsPromise,
            ]);

            const primaryAccount = accounts !== null? accounts.find((a) => a[1] === true): null;

            if(user.length === 0)throw new ResourceNotFound('User doesnt exists');
            return User.fromPrimitives({
                id: user[0]!.id,
                name: user[0]!.name,
                ...(user[0]!.urlImage !== null && {urlImage: user[0]!.urlImage as string}),
                ...((primaryAccount && primaryAccount !== null) && {primaryAccount: primaryAccount[0]}),
                accounts: accounts !== null? accounts.map((a) => a[0]): [],
            });
        });
    }
}
