import IdMember from '../objects/IdMember';
import MemberStatus from '../objects/MemberStatus';
import MemberRole from '../objects/MemberRole';
import Entity from '../../../../shared/core/model/Entity';
import MemberAddedToProject from '../events/MemberAddedToProject';
import DateTime from '../../../../shared/core/objects/DateTime';
import MemberBlocked from '../events/MemberBlocked';
import MemberActived from '../events/MemberActived';
import MemberDeleted from '../events/MemberDeleted';
import ProjectMetadata from '../objects/ProjectMetadata';
import IdEntity from '../../../../shared/core/objects/IdEntity';
import type MemberParams from '../interfaces/MemberParams';
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
    params: Omit<MemberParams, 'projectMetadata'> & { actor: string; key: string }
  ): Member {
    const idMember = new IdMember(params.id);
    const idProject = new IdEntity(params.idProject);
    const idAccount = new IdEntity(params.idAccount);
    const role = new MemberRole(params.role);
    const status = MemberStatus.create(params.status);
    const actor = new IdEntity(params.actor);
  
    const member = new Member(
      idMember,
      idProject,
      idAccount,
      status,
      role,
      new ProjectMetadata(false, false)
    );

    member.addEvent(
      new MemberAddedToProject(params.key, DateTime.now(), actor, idProject, idMember, member.toPrimitives()),
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
      new ProjectMetadata(params.projectMetadata.isFavorite, params.projectMetadata.watch)  
    );
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
      id: super.getID().toString(),
      idProject: this.idProject.toString(),
      idAccount: this.idAccount.toString(),
      status: this.status.getStatus(),
      role: this.role.getRole(),
      projectMetadata:{
        isFavorite: this.projectMetadata.favorite(),
        watch: this.projectMetadata.isWatching()
      }    
    };
  }
}
