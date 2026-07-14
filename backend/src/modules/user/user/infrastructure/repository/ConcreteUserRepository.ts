import { NodePgDatabase} from "drizzle-orm/node-postgres";
import type { Transaction } from "../../../../shared/core/transaction/Transaction";
import type User from "../../core/model/User";
import type UserRepository from "../../core/repository/UserRepository";

export default class ConcreteUserRepository implements UserRepository{
    async createUser(user: User, tx?: Transaction): Promise<void> {
        const transaction = tx as unknown as NodePgDatabase;
        const sql = ;
        await transaction.execute();
    }
}
