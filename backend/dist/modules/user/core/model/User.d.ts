import IdEntity from '../../../shared/core/objects/IdEntity';
import Entity from '../../../shared/core/model/Entity';
import type UserParams from '../interfaces/UserParams';
export default class User extends Entity {
    private accounts;
    private primaryAccount;
    private constructor();
    static fromPrimitives(params: UserParams): User;
    addAccount(account: IdEntity): void;
    changePrimaryAccount(key: string, actor: IdEntity, newPrimary: IdEntity): void;
    removeAccount(account: IdEntity): void;
    getAccounts(): IdEntity[];
    getPrimaryAccount(): IdEntity | null;
    toPrimitives(): UserParams;
}
//# sourceMappingURL=User.d.ts.map