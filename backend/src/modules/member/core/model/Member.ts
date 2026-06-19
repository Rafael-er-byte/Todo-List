import IdMember from '../objects/IdMember';
import MemberStatus from '../objects/MemberStatus';
import MemberRole from '../objects/MemberRole';
import Entity from '../../../shared/core/model/Entity';
import MemberAddedToProject from '../events/MemberAddedToProject';
import DateTime from '../../../shared/core/objects/DateTime';
import MemberBlocked from '../events/MemberBlocked';
import MemberActived from '../events/MemberActived';
import MemberDeleted from '../events/MemberDeleted';
import ProjectMetadata from '../objects/ProjectMetadata';
import IdEntity from '../../../shared/core/objects/IdEntity';
import type MemberParams from '../interfaces/MemberParams';
import DeletedAt from '../../../shared/core/objects/DeletedAt';
import MemberRoleChanged from '../events/MemberRoleChanged';

export default class Member extends Entity {
  private status!: MemberStatus;
  private role!: MemberRole;
  private idProject!: IdEntity;
  private idAccount!: IdEntity;
  private projectMetadata!: ProjectMetadata;

  private constructor(
    id: IdMember,
    idProject: IdEntity,
    idAccount: IdEntity,
    status: MemberStatus,
    role: MemberRole,
    projectMetadata: ProjectMetadata
  ) {
    super(id);
    this.idProject = idProject;
    this.idAccount = idAccount;
    this.status = status;
    this.role = role;
    this.projectMetadata = projectMetadata;
  }

  public static create(
    idMember:IdMember,
    idProject: IdEntity,
    idAccount: IdEntity,
    role: MemberRole,
    status: MemberStatus,
    modifier: IdEntity,
    key: string

  ): Member {
  
    const member = new Member(
      idMember,
      idProject,
      idAccount,
      status,
      role,
      new ProjectMetadata(false, false)
    );

    member.create();
    member.addEvent(
      new MemberAddedToProject(key, DateTime.now(), modifier, idProject, idMember, member.toPrimitives()),
    );
    return member;
  }

  public static fromPrimitives(params: MemberParams): Member {
    const member = new Member(
      new IdMember(params.id),
      new IdEntity(params.idProject),
      new IdEntity(params.idAccount),
      MemberStatus.create(params.status),
      new MemberRole(params.role),
      new ProjectMetadata()  
    );

    member.build(DeletedAt.createFromPrimitive(params.deletedAt));
    return member;
  }

  public block(key: string, actor: IdEntity): void {
    this.status = MemberStatus.blocked();
    this.addEvent(new MemberBlocked(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
  }

  public unBlock(key: string, actor: IdEntity): void {
    this.status = MemberStatus.active();
    this.addEvent(new MemberActived(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
  }

  public changeRole(key: string, actor: IdEntity, role: MemberRole): void {
    this.role = role;
    this.addEvent(new MemberRoleChanged(key, DateTime.now(), actor, this.getIdProject(), super.getID(), role));
  }

  public delete(key: string, actor: IdEntity): void {
    this.addEvent(new MemberDeleted(key, DateTime.now(), actor, this.getIdProject(), super.getID()));
    super.softDelete();
  }

  public isBlocked(): boolean {
    return this.status.isBlocked();
  }

  public watchProject(): void {
    this.projectMetadata = this.projectMetadata.watchProject();
  }

  public unWatchProject(): void {
    this.projectMetadata = this.projectMetadata.unwatchProject();
  }

  public markAsFavorite(): void {
    this.projectMetadata = this.projectMetadata.markAsFavorite();
  }

  public unMarkAsFavorite(): void {
    this.projectMetadata = this.projectMetadata.unmarkAsFavorite();
  }

  public getIdProject(): IdEntity {
    return this.idProject;
  }

  public toPrimitives(): MemberParams {
    return {
      id: super.getID().getID(),
      idProject: this.idProject.getID(),
      idAccount: this.idAccount.getID(),
      status: this.status.getStatus(),
      role: this.role.getRole(),
      deletedAt: super.getDeletedAt().toPrimitive()
    };
  }
}
