import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import DbBuilder from "./Db";
import type { Transaction, TransactionExectution } from "../../../modules/shared/core/transaction/Transaction";

export default class ConcreteTransaction implements Transaction<NodePgDatabase>{
    private db!: NodePgDatabase;

    public async init(): Promise<void>{
        this.db = await DbBuilder();
    }
    
    async withTransaction<T>(exec: TransactionExectution<NodePgDatabase, T>):Promise<T>{
        return await this.db.transaction(exec);
    }

    getDb(): NodePgDatabase{
        return this.db;
    }
}
