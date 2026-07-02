import Entity from '../../../../shared/core/model/Entity';
import IdAccount from '../objects/IdAccount';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import DateTime from '../../../../shared/core/objects/DateTime';
import None from '../../../../shared/core/objects/None';
import type AccountParams from '../interfaces/AccountParams';
import Email from '../../../../shared/core/objects/Email';
import AccountName from '../objects/AccountName';
import Url from '../../../../shared/core/objects/URL';
import InvalidParameters from '../../../../shared/core/errors/InvalidParameters';

export default class Account extends Entity {
	private email!: Email;
	private name!: AccountName;
	private owner: IdEntity;
	private isPrimary: boolean = false;
	private createdAt!: DateTime;
	private provider: string;
	private profileImage: Url | None = new None();

	private constructor(
		id: IdAccount,
		email: Email,
		isPrimary = false,
		name: AccountName,
		provider: string,
		profileImage: Url | None,
		owner: IdEntity,
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
		params: Omit<AccountParams, 'createdAt'>,
	): Account {
		const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
		const createdAt = DateTime.now();
		const account = new Account(
			new IdAccount(params.id),
			new Email(params.email),
			params.isPrimary,
			new AccountName(params.name),
			params.provider,
			profileImage,
			new IdEntity(params.userId),
			createdAt,
		);
		return account;
	}

	public static fromPrimitives(params: AccountParams): Account {
		const provider = params.provider;
		if(!provider) throw new InvalidParameters("The provider is required");
		const profileImage = params.profileImage ? new Url(params.profileImage) : new None();
		const owner = new IdEntity(params.userId);
		if(!params.createdAt) throw new InvalidParameters("The account must include a creation date");
		const createdAt = DateTime.create(params.createdAt);

		return new Account(
			new IdAccount(params.id),
			new Email(params.email),
			params.isPrimary,
			new AccountName(params.name),
			provider,
			profileImage,
			owner,
			createdAt,
		);
	}

	public toPrimitives(): AccountParams {
		return {
			id: super.getID().toString(),
			email: this.email.getEmail(),
			isPrimary: this.isPrimary,
			name: this.name.toPrimitives(),
			provider: this.provider,
			profileImage: this.profileImage instanceof None ? null : (this.profileImage as Url).getUrl(),
			userId: this.owner.toString(),
			createdAt: this.createdAt.getDate()
		};
	}

	public getProfileImage(): Url | None{
		return this.profileImage;
	}

	public getEmail(): Email {
		return this.email;
	}

	public getName(): AccountName {
		return this.name;
	}
}
