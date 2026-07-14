import IdEntity from '../../../../shared/core/objects/IdEntity';
import DuplicateAccount from '../errors/DuplicateAccount';
import AccountDoesntExist from '../errors/AccountDoesntExist';
import type UserParams from '../interfaces/UserParams';
import InvalidOperation from '../../../../shared/core/errors/InvalidOperation';
import None from '../../../../shared/core/objects/None';
import Entity from '../../../../shared/core/model/Entity';

export default class User extends Entity {
  private accounts: IdEntity[] = [];
  private primaryAccount!: IdEntity | None;

  private constructor(id: IdEntity, accounts: IdEntity[], primary: IdEntity | None) {
    super(id);
    this.accounts = accounts;
    this.primaryAccount = primary;
  }

  public static fromPrimitives(params: UserParams): User {
    const id = new IdEntity(params.id);
    const accounts = (params.accounts || []).map((a) => new IdEntity(a));
    const primary = params.primaryAccount? new IdEntity(params.primaryAccount): new None();
    return new User(id, accounts, primary);
  }

  public addAccount(account: IdEntity): void {
    const exists = this.accounts.find((a) => a.toString() === account.toString());
    if (exists) throw new DuplicateAccount(account.toString());
    this.accounts.push(account);
  }

  public changePrimaryAccount(newPrimary: IdEntity): void {
    if(this.primaryAccount instanceof None) throw new InvalidOperation("Primary account doesnt exists");
    const found = this.accounts.find((a) => a.toString() === newPrimary.toString());
    if (!found) {
      throw new AccountDoesntExist(newPrimary.toString());
    }

    this.primaryAccount = newPrimary;
  }

  public removeAccount(account: IdEntity): void {
    if(this.primaryAccount instanceof None) throw new InvalidOperation("Primary account doesnt exists");
    const found = this.accounts.find((a) => a.toString() === account.toString());
    if (!found) throw new AccountDoesntExist(account.toString());

    if (this.accounts.length <= 1) throw new InvalidOperation('The user at least must have one account');
    this.accounts = this.accounts.filter((a) => a.toString() !== account.toString());

    if(account.toString() === this.primaryAccount.toString())this.primaryAccount = this.accounts[0] as IdEntity;
  }

  public getAccounts(): IdEntity[] {
    return this.accounts;
  }

  public getPrimaryAccount(): IdEntity {
    if(this.primaryAccount instanceof None) throw new InvalidOperation("Primary account doesnt exists");
    return this.primaryAccount;
  }

  public toPrimitives(): UserParams {
    if(this.primaryAccount instanceof None) throw new InvalidOperation("Primary account doesnt exists");
    return {
      id: super.getId().toString(),
      primaryAccount:this.primaryAccount.toString(),
      accounts: this.accounts.map((a) => a.toString()),
    };
  }
}
