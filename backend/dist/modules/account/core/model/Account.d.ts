import Entity from '../../../shared/core/model/Entity';
import IdAccount from '../objects/IdAccount';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type AccountParams from '../interfaces/AccountParams';
import Email from '../../../shared/core/objects/Email';
import AccountName from '../objects/AccountName';
export default class Account extends Entity {
    private email;
    private name;
    private provider;
    private profileImage;
    private owner;
    private isPrimary;
    private createdAt;
    private constructor();
    static create(key: string, id: IdAccount, actor: IdEntity, params: {
        email: Email;
        name: AccountName;
        provider?: string | null;
        profileImage?: string | null;
        owner?: IdEntity | null;
        isPrimary?: boolean;
    }): Account;
    static fromPrimitives(params: AccountParams): Account;
    toPrimitives(): AccountParams;
    getEmail(): Email;
    getName(): AccountName;
}
//# sourceMappingURL=Account.d.ts.map