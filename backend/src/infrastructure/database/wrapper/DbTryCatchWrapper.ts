import { DatabaseError } from "pg";
import { DbErrorDispenser } from "../error/DbErrorDispenser";
import { DrizzleQueryError } from "drizzle-orm";

type Action<Result> = () => Promise<Result>;

export const DbTryCatchWrapper = async <R>(action: Action<R>) => {
    let result: R;
    try {
        result = await action();
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            const pgError = 
                error instanceof DatabaseError? error: 
                error instanceof DrizzleQueryError && error.cause instanceof DatabaseError? error.cause: undefined;
            const handler = DbErrorDispenser[pgError?.code ?? ''] ?? DbErrorDispenser.default;
            const err = handler!(error);
            throw err;
        }
        throw new Error(`Unmanaged error: ${error}`);
    }

    return result;
}
