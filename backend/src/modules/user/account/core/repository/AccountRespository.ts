import type Transaction from "../../../../shared/core/repository/Transacction";
import type Account from "../model/Account";

export default interface AccountRepository{
    createAccount(account: Account, tx?: Transaction): Promise<void>
}