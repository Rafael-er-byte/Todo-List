export type TransactionExectution<T> = (tx:Transaction) => Promise<T>;

export abstract class Transaction{
    abstract begin(): Promise<void>;
    abstract end(): Promise<void>;
    abstract cancel(): Promise<void>;
    async withTransaction<T>(exec: TransactionExectution<T>): Promise<T>{
        let result: T;
        try{
            await this.begin();
            result = await exec(this);
            await this.end();
        }catch(err){
            await this.cancel();
            throw err;
        }
        return result;
    }
}
