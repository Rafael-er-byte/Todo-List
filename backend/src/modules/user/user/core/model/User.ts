import IdEntity from '../../../../shared/core/objects/IdEntity';
import Entity from '../../../../shared/core/model/Entity';
import DateTime from '../../../../shared/core/objects/DateTime';
import AccountChanged from '../events/AccountChanged';
import DuplicateAccount from '../errors/DuplicateAccount';
import AccountDoesntExist from '../errors/AccountDoesntExist';
import type UserParams from '../interfaces/UserParams';
import InvalidOperation from '../../../../shared/core/errors/InvalidOperation';
import ID from '../../../../shared/core/objects/ID';

export default class User extends Entity {
  private accounts: IdEntity[] = [];
  private primaryAccount!: IdEntity;

  private constructor(id: IdEntity, accounts: IdEntity[], primary: IdEntity) {
    super(id);
    this.accounts = accounts;
    this.primaryAccount = primary;
  }

  public static fromPrimitives(params: UserParams): User {
    const id = new IdEntity(params.id);
    const accounts = (params.accounts || []).map((a) => new IdEntity(a));
    const primary = new IdEntity(params.primaryAccount);
    return new User(id, accounts, primary);
  }

  public addAccount(account: IdEntity): void {
    const exists = this.accounts.find((a) => a.getID() === account.getID());
    if (exists) throw new DuplicateAccount(account.getID());
    this.accounts.push(account);
  }

  public changePrimaryAccount(newPrimary: IdEntity): void {
    const previous = this.primaryAccount.getID();
    const found = this.accounts.find((a) => a.getID() === newPrimary.getID());
    if (!found) {
      throw new AccountDoesntExist(newPrimary.getID());
    }

    this.primaryAccount = newPrimary;
    this.addEvent(
      new AccountChanged(ID.generateId().toString(), DateTime.now(), this.getID(), super.getID(), newPrimary, { previousPrimary: previous }),
    );
  }

  public removeAccount(account: IdEntity): void {
    const found = this.accounts.find((a) => a.getID() === account.getID());
    if (!found) throw new AccountDoesntExist(account.getID());

    if (this.accounts.length <= 1) throw new InvalidOperation('The user at least must have one account');
    this.accounts = this.accounts.filter((a) => a.getID() !== account.getID());

    if(account.getID() === this.primaryAccount.getID())this.primaryAccount = this.accounts[0] as IdEntity;
  }

  public getAccounts(): IdEntity[] {
    return this.accounts;
  }

  public getPrimaryAccount(): IdEntity {
    return this.primaryAccount;
  }

  public toPrimitives(): UserParams {
    return {
      id: super.getID().getID(),
      primaryAccount:this.primaryAccount.getID(),
      accounts: this.accounts.map((a) => a.getID()),
    };
  }
}
