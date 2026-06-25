import Entity from '../../../shared/core/model/Entity';
import IdAccount from '../objects/IdAccount';
import IdEntity from '../../../shared/core/objects/IdEntity';
import DateTime from '../../../shared/core/objects/DateTime';
import None from '../../../shared/core/objects/None';
import AccountCreated from '../events/AccountCreated';
import type AccountParams from '../interfaces/AccountParams';
import Email from '../../../shared/core/objects/Email';
import AccountName from '../objects/AccountName';
import Url from '../../../shared/core/objects/URL';
import InvalidParameters from '../../../shared/core/errors/InvalidParameters';

export default class Account extends Entity {
	private email!: Email;
	private name!: AccountName;
	private provider: string | None = new None();
	private profileImage: Url | None = new None();
	private owner: IdEntity | None = new None();
	private isPrimary: boolean = false;
	private createdAt!: DateTime;

	private constructor(
		id: IdAccount,
		email: Email,
		isPrimary = false,
		name: AccountName,
		provider: string | None,
		profileImage: Url | None,
		owner: IdEntity | None,
		createdAt: DateTime
	) {
		super(id);
		this.email = email;
		this.name = name;
		this.provider = provider;
		this.profileImage = profileImage;
		this.owner = owner;
		this.isPrimary = isPrimary;
		this.createdAt = createdAt;
	}

	public static create(
		key: string,
		id: IdAccount,
		actor: IdEntity,
		params: { email: Email; name: AccountName; provider?: string | null; profileImage?: string | null; owner?: IdEntity | null; isPrimary?: boolean },
	): Account {
		const provider = params.provider ? params.provider : new None();
		const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
		const owner = params.owner ? params.owner : new None();
		const createdAt = DateTime.now();

		const account = new Account(id, params.email, params.isPrimary, params.name, provider as any, profileImage as any, owner as any, createdAt);
		account.addEvent(new AccountCreated(key, DateTime.now(), actor, actor, id, account.toPrimitives()));
		return account;
	}

	public static fromPrimitives(params: AccountParams): Account {
		const provider = params.provider ? params.provider : new None();
		const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
		const owner = params.userId ? new IdEntity(params.userId) : new None();
		if(!params.createdAt) throw new InvalidParameters("The account must include a creation date");
		const createdAt = DateTime.create(params.createdAt);

		return new Account(
			new IdAccount(params.id),
			new Email(params.email),
			params.isPrimary,
			new AccountName(params.name),
			provider as any,
			profileImage as any,
			owner as any,
			createdAt,
		);
	}

	public toPrimitives(): AccountParams {
		return {
			id: super.getID().getID(),
			email: this.email.getEmail(),
			isPrimary: this.isPrimary,
			name: this.name.toPrimitives(),
			provider: this.provider instanceof None ? null : (this.provider as string),
			profileImage: this.profileImage instanceof None ? null : (this.profileImage as Url).getUrl(),
			userId: this.owner instanceof None ? null : (this.owner as IdEntity).getID(),
			createdAt: this.createdAt.getDate()
		};
	}

	public getEmail(): Email {
		return this.email;
	}

	public getName(): AccountName {
		return this.name;
	}
}
