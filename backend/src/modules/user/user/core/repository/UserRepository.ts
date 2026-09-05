import type User from "../model/User";
import type IdEntity from "../../../../shared/core/objects/IdEntity";

export default interface UserRepository<TX> {
    createUser(user: User, tx?: TX): Promise<void>
    updateUser(user: User): Promise<void>
    getUserById(id: IdEntity, withAccounts?: boolean): Promise<User>
    deleteUserById(id: IdEntity): Promise<void>
}
