import Entity from '../../../shared/core/model/Entity';
import IdAccount from '../objects/IdAccount';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DateTime from '../../../shared/core/objects/DateTime';
import None from '../../../shared/core/objects/None';
import Email from '../../../shared/core/objects/Email';
import AccountName from '../objects/AccountName';
import Url from '../../../shared/core/objects/URL';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';
export default class Account extends Entity {
    constructor(id, email, isPrimary = false, name, provider, profileImage, owner, createdAt) {
        super(id);
        this.isPrimary = false;
        this.profileImage = new None();
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.profileImage = profileImage;
        this.owner = owner;
        this.isPrimary = isPrimary;
        this.createdAt = createdAt;
    }
    static create(id, email, name, provider, profileImage, owner, isPrimary) {
        const createdAt = DateTime.now();
        const account = new Account(id, email, isPrimary, name, provider, profileImage, owner, createdAt);
        return account;
    }
    static fromPrimitives(params) {
        const provider = params.provider;
        if (!provider)
            throw new InvalidParameters("The provider is required");
        const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
        const owner = new IdEntity(params.userId);
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
            provider: this.provider,
            profileImage: this.profileImage instanceof None ? null : this.profileImage.getUrl(),
            userId: this.owner.getID(),
            createdAt: this.createdAt.getDate()
        };
    }
    getProfileImage() {
        return this.profileImage;
    }
    getEmail() {
        return this.email;
    }
    getName() {
        return this.name;
    }
}
//# sourceMappingURL=Account.js.map