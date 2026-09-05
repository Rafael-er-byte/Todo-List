import type IdEntity from "../../../../shared/core/objects/IdEntity";
import type Account from "../model/Account";

export default interface AccountRepository<TX>{
    createAccount(account: Account, tx?: TX): Promise<void>
    updateAccount(account: Account): Promise<void>
    existsAccountOwnerByAccountIdAndProvider(accountId: string, provider: string, tx?: TX): Promise<boolean>
    deleteAccountById(id: IdEntity): Promise<void>
}
