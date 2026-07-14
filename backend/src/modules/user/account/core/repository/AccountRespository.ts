import type { Transaction } from "../../../../shared/core/transaction/Transaction";
import type Account from "../model/Account";

export default interface AccountRepository{
    createAccount(account: Account, tx?: Transaction): Promise<void>
}