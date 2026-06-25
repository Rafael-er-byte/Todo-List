import Entity from '../../../shared/core/model/Entity';
import IdAccount from '../objects/IdAccount';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DateTime from '../../../shared/core/objects/DateTime';
import None from '../../../shared/core/objects/None';
import AccountCreated from '../events/AccountCreated';
import Email from '../../../shared/core/objects/Email';
import AccountName from '../objects/AccountName';
import Url from '../../../shared/core/objects/URL';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
export default class Account extends Entity {
    constructor(id, email, isPrimary = false, name, provider, profileImage, owner, createdAt) {
        super(id);
        this.provider = new None();
        this.profileImage = new None();
        this.owner = new None();
        this.isPrimary = false;
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.profileImage = profileImage;
        this.owner = owner;
        this.isPrimary = isPrimary;
        this.createdAt = createdAt;
    }
    static create(key, id, actor, params) {
        const provider = params.provider ? params.provider : new None();
        const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
        const owner = params.owner ? params.owner : new None();
        const createdAt = DateTime.now();
        const account = new Account(id, params.email, params.isPrimary, params.name, provider, profileImage, owner, createdAt);
        account.addEvent(new AccountCreated(key, DateTime.now(), actor, actor, id, account.toPrimitives()));
        return account;
    }
    static fromPrimitives(params) {
        const provider = params.provider ? params.provider : new None();
        const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
        const owner = params.userId ? new IdEntity(params.userId) : new None();
        if (!params.createdAt)
            throw new InvalidParameters("The account must include a creation date");
        const createdAt = DateTime.create(params.createdAt);
        return new Account(new IdAccount(params.id), new Email(params.email), params.isPrimary, new AccountName(params.name), provider, profileImage, owner, createdAt);
    }
    toPrimitives() {
        return {
            id: super.getID().getID(),
            email: this.email.getEmail(),
            isPrimary: this.isPrimary,
            name: this.name.toPrimitives(),
            provider: this.provider instanceof None ? null : this.provider,
            profileImage: this.profileImage instanceof None ? null : this.profileImage.getUrl(),
            userId: this.owner instanceof None ? null : this.owner.getID(),
            createdAt: this.createdAt.getDate()
        };
    }
    getEmail() {
        return this.email;
    }
    getName() {
        return this.name;
    }
}
//# sourceMappingURL=Account.js.map