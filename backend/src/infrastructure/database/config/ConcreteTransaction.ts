import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type { Transaction, TransactionExectution } from "../../../modules/shared/core/transaction/Transaction";

export default class ConcreteTransaction implements Transaction<NodePgDatabase>{
    constructor(private db: NodePgDatabase){}
    
    async withTransaction<T>(exec: TransactionExectution<NodePgDatabase, T>):Promise<T>{
        return await this.db.transaction(exec);
    }

    getDb(): NodePgDatabase{
        return this.db;
    }
}
