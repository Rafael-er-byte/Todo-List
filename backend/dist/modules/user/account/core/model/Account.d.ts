import Entity from '../../../../shared/core/model/Entity';
import None from '../../../../shared/core/objects/None';
import type AccountParams from '../interfaces/AccountParams';
import Email from '../../../../shared/core/objects/Email';
import AccountName from '../objects/AccountName';
import Url from '../../../../shared/core/objects/URL';
export default class Account extends Entity {
    private email;
    private name;
    private owner;
    private isPrimary;
    private createdAt;
    private provider;
    private profileImage;
    private constructor();
    static create(params: Omit<AccountParams, 'createdAt'>): Account;
    static fromPrimitives(params: AccountParams): Account;
    toPrimitives(): AccountParams;
    getProfileImage(): Url | None;
    getEmail(): Email;
    getName(): AccountName;
}
//# sourceMappingURL=Account.d.ts.map