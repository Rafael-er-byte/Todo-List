export type TransactionExectution<TE, T> = (tx:TE) => Promise<T>;

export interface Transaction<TE>{
    withTransaction<T>(exec: TransactionExectution<TE, T>): Promise<T>;
}
